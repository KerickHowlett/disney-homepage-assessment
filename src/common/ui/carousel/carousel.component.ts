import { Component } from '@common/decorators';
import { isNil, isNull } from '@common/utils';
import type { VirtualScroll } from '../virtual-scroll';

import css from './carousel.component.css?inline';

export const INTERACTIVE_TILE = 'interactive-tile';
export const CAROUSEL_ITEM = 'carousel-item';
export const CAROUSEL_TRACK = 'carousel-track';
export const FULLY_VISIBLE = 'fully-visible';
export const PARTIALLY_VISIBLE = 'partially-visible';
export const WATCH_TARGET = 'watch-target';

@Component({
    selector: 'disney-carousel',
})
export class CarouselComponent extends HTMLElement {
    private readonly contentObserver: MutationObserver = new MutationObserver(this.watchItemsForStyling.bind(this));
    private readonly element: ShadowRoot;
    private readonly resizeObserver: ResizeObserver = new ResizeObserver(this.watchItemsForStyling.bind(this));
    private observer?: IntersectionObserver;

    constructor() {
        super();
        this.element = this.attachShadow({ mode: 'open' });
    }

    get carouselItems(): HTMLElement[] {
        return Array.from(this.content.children) as HTMLElement[];
    }

    get content(): HTMLElement {
        return this.slotElement.assignedElements()[0] as HTMLElement;
    }

    get slotElement(): HTMLSlotElement {
        return this.element.querySelector('slot') as HTMLSlotElement;
    }

    get virtualScroll(): VirtualScroll {
        return this.element.querySelector('disney-virtual-scroll') as VirtualScroll;
    }

    connectedCallback(): void {
        this.render();
        this.bindObservers();
        this.watchItemsForStyling();
    }

    disconnectCallback(): void {
        this.observer?.disconnect();
        this.resizeObserver?.disconnect();
    }

    render(): void {
        this.element.innerHTML = `
            <style>${css}</style>
            <disney-virtual-scroll orientation="horizontal">
                <slot name="carousel-items" slot="content"></slot>
            </disney-virtual-scroll>
        `;
    }

    private bindObservers(): void {
        this.contentObserver.observe(this.content, { childList: true });
        this.resizeObserver.observe(this.slotElement);
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
        for (const { target, intersectionRatio } of entries) {
            target.classList.add(CAROUSEL_ITEM);

            if (this.isPartiallyVisible(intersectionRatio)) {
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
        this.setInteractiveAttributeForFullyVisibleItems();
    }

    private watchItemsForStyling(): void {
        this.observer = new IntersectionObserver(this.setVisibilityStylingOnChange.bind(this), {
            root: this.virtualScroll.viewport,
            threshold: [0, 0.2, 0.4, 0.5, 0.6, 0.8, 1],
        });
        this.carouselItems.forEach((item: HTMLElement): void => {
            const targetElement: HTMLElement | null = this.getTrueElement(item);
            if (isNull(targetElement)) return;
            this.observer!.observe(targetElement);
        });
    }
}
