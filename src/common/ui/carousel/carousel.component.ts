import { Component, Debounce } from '@common/decorators';
import { clamp, isNil, isNull, isUndefined } from '@common/utils';

import css from './carousel.component.css?inline';

export const INTERACTIVE_TILE = 'interactive-tile';
export const CAROUSEL_ITEM = 'carousel-item';
export const CAROUSEL_TRACK = 'carousel-track';
export const FULLY_VISIBLE = 'fully-visible';
export const PARTIALLY_VISIBLE = 'partially-visible';
export const WATCH_TARGET = 'watch-target';

type Horizontal = 'LEFT' | 'RIGHT';

@Component({
    selector: 'disney-carousel',
})
export class CarouselComponent extends HTMLElement {
    private readonly element: ShadowRoot;

    private carouselItems: HTMLElement[] = [];
    private observer?: IntersectionObserver;

    // private indexOfFocusedItem = -1;
    private partiallyVisibleItemRatio = 0;
    private totalItems = 0;
    private xPosition = 0;
    private widthOfItem = 0;

    constructor() {
        super();
        this.element = this.attachShadow({ mode: 'open' });
    }

    get activeItem(): HTMLElement | undefined {
        const item: HTMLElement | undefined = this.carouselItems.find((item: HTMLElement): boolean =>
            isNil(item.shadowRoot?.activeElement),
        );
        if (isUndefined(item)) return undefined;
        return this.getTrueElement(item)!;
    }

    get carouselTrack(): HTMLDivElement {
        return this.element.querySelector<HTMLDivElement>(`.${CAROUSEL_TRACK}`)!;
    }

    get carouselViewport(): HTMLDivElement {
        return this.element.querySelector<HTMLDivElement>('.carousel-viewport')!;
    }

    get slotElement(): HTMLSlotElement {
        return this.element.querySelector<HTMLSlotElement>('slot')!;
    }

    connectedCallback(): void {
        this.render();
        this.bindEvents();
    }

    disconnectCallback(): void {
        this.observer?.disconnect();
        window.removeEventListener('resize', this.onResize.bind(this));
        this.removeEventListener('focusin', this.turnCarouselOnFocus.bind(this), true);
        this.slotElement.removeEventListener('slotchange', this.updateCarouselItems.bind(this));
    }

    render(): void {
        this.element.innerHTML = `
            <style>${css}</style>
            <div class="carousel-viewport">
                <div class="carousel-track" style="will-change: transform; transform: translate3d(0px, 0px, 0px);">
                    <slot name="carousel-items"></slot>
                </div>
            </div>
        `;
    }

    updateCarouselItems(): void {
        this.measureCarouselElements();
        this.setTrackWidth();
        this.watchItemsForStyling();
    }

    private bindEvents(): void {
        this.slotElement.addEventListener('slotchange', this.updateCarouselItems.bind(this));
        window.addEventListener('resize', this.onResize.bind(this));
        this.addEventListener('focusin', this.turnCarouselOnFocus.bind(this), true);
    }

    // @NOTE: The most outer element can sometimes not register as an element or
    //        even as one with actual "mass" (i.e., height & width), so this was
    //        written to serve as a tool to find a usable element much easier.
    //        This may be due to the nature of ShadowDOMs -- additional research
    //        is needed.
    private getTrueElement(item: Element): HTMLElement | null {
        const itemRoot: HTMLElement | ShadowRoot = isNil(item?.shadowRoot) ? (item as HTMLElement) : item.shadowRoot;
        if (isNil(itemRoot)) return null;
        return itemRoot.querySelector('div');
    }

    private isCompletelyVisible(visibilityPercentage: number): boolean {
        return visibilityPercentage === 1;
    }

    private isPartiallyVisible(visibilityPercentage: number): boolean {
        return visibilityPercentage > 0 && visibilityPercentage < 1;
    }

    private moveCarousel(direction: Horizontal): void {
        const positionChange: number = direction === 'LEFT' ? this.widthOfItem : -1 * this.widthOfItem;
        const minPosition: number = -1 * this.widthOfItem * this.totalItems;
        this.xPosition = clamp(this.xPosition + positionChange, minPosition, 0);
        this.carouselTrack.style.transform = `translate3d(${this.xPosition}px, 0px, 0px)`;
    }

    private measureCarouselElements(): void {
        const carouselItemsPlaceholder: HTMLElement = this.slotElement.assignedElements()[0] as HTMLElement;
        this.carouselItems = Array.from(carouselItemsPlaceholder.children) as HTMLElement[];
        this.totalItems = this.carouselItems.length;

        const firstTargetElement: HTMLElement | null = this.getTrueElement(this.carouselItems[0]);
        if (isNull(firstTargetElement)) return;

        this.widthOfItem = firstTargetElement?.offsetWidth || 0;
    }

    private setTrackWidth(): void {
        const maxWidth: number = this.widthOfItem * this.totalItems;
        this.carouselTrack.style.width = `${maxWidth}px`;
        this.slotElement.style.width = `${maxWidth}px`;
    }

    // @TODO: This should go into a separate component or service that ties in
    //        more closely with the content tiles, since this feature is tied in
    //         with their navigation controls.
    private setInteractiveAttributeForFullyVisibleItems(): void {
        const visibleItemElements: HTMLElement[] = this.carouselItems.reduce(
            (visibleItemElements: HTMLElement[], item: HTMLElement): HTMLElement[] => {
                const target: HTMLElement | null = this.getTrueElement(item);
                if (isNull(target) || !target.classList.contains(INTERACTIVE_TILE)) return visibleItemElements;
                return [...visibleItemElements, target];
            },
            [],
        );
        visibleItemElements.forEach((item: HTMLElement, index: number): void => {
            item.setAttribute(INTERACTIVE_TILE, `${index + 1}`);
        });
    }

    private setVisibilityStylingOnChange(entries: IntersectionObserverEntry[]): void {
        let ratioForPartiallyVIsibleItem = 0;
        for (const { target, intersectionRatio } of entries) {
            target.classList.add(CAROUSEL_ITEM);

            if (this.isPartiallyVisible(intersectionRatio)) {
                ratioForPartiallyVIsibleItem = intersectionRatio;
                target.removeAttribute(INTERACTIVE_TILE);
                target.classList.remove(FULLY_VISIBLE, INTERACTIVE_TILE);
                target.classList.add(PARTIALLY_VISIBLE);
                continue;
            }

            if (this.isCompletelyVisible(intersectionRatio)) {
                target.classList.remove(PARTIALLY_VISIBLE);
                target.classList.add(FULLY_VISIBLE, INTERACTIVE_TILE);
            }
        }
        this.partiallyVisibleItemRatio = ratioForPartiallyVIsibleItem;
        this.setInteractiveAttributeForFullyVisibleItems();
    }

    // @NOTE: Here for performance, and because, for some unknown reason, the event
    //        that sets the width for the carousel track is not firing on init
    //        when the debounce decorator is placed on the "updateCarouselItems"
    //        method directly, but it does so fine here.
    @Debounce(100)
    private onResize(): void {
        this.updateCarouselItems();
    }

    private turnCarouselOnFocus(event: FocusEvent): void {
        if (isNull(event.target)) return;

        const carouselItem: HTMLElement | null = this.getTrueElement(event.target as HTMLElement);
        if (isNull(carouselItem)) return;

        const { left: leftOfItem, right: rightOfItem } = carouselItem.getBoundingClientRect();
        const leftOfCarousel: number = this.carouselViewport.getBoundingClientRect().left;
        if (leftOfItem <= leftOfCarousel) {
            return this.moveCarousel('LEFT');
        }
        const widthOfPartiallyVisibleItem: number = this.widthOfItem * this.partiallyVisibleItemRatio;
        if (rightOfItem > leftOfCarousel + this.carouselViewport.offsetWidth - widthOfPartiallyVisibleItem) {
            return this.moveCarousel('RIGHT');
        }
    }

    private watchItemsForStyling(): void {
        this.observer = new IntersectionObserver(this.setVisibilityStylingOnChange.bind(this), {
            root: this,
            threshold: [0, 0.2, 0.4, 0.5, 0.6, 0.8, 1],
        });
        this.carouselItems.forEach((item: HTMLElement): void => {
            const targetElement: HTMLElement | null = this.getTrueElement(item);
            if (isNull(targetElement)) return;
            this.observer!.observe(targetElement);
        });
    }
}
