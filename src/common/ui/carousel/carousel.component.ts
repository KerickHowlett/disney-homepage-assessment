import { Component } from '@common/decorators';
import { isNil, isNull } from '@common/utils';
import type { VirtualScroll } from '../virtual-scroll';

import css from './carousel.component.css?inline';

export const INTERACTIVE_TILE = 'interactive-tile';
export const CAROUSEL_ITEM = 'carousel-item';
export const CAROUSEL_TRACK = 'carousel-track';
export const FULLY_VISIBLE = 'fully-visible';
export const IS_FULLY_VISIBLE = 'is-fully-visible';
export const PARTIALLY_VISIBLE = 'partially-visible';
export const WATCH_TARGET = 'watch-target';

@Component({
    selector: 'disney-carousel',
})
export class CarouselComponent extends HTMLElement {
    private readonly contentObserver: MutationObserver = new MutationObserver(
        this.watchItemsForLevelsOfVisibility.bind(this),
    );
    private readonly element: ShadowRoot;
    private readonly resizeObserver: ResizeObserver = new ResizeObserver(
        this.watchItemsForLevelsOfVisibility.bind(this),
    );
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
        this.watchItemsForLevelsOfVisibility();
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

    private setVisibilityStylingOnChange(entries: IntersectionObserverEntry[]): void {
        for (const { target, intersectionRatio } of entries) {
            target.classList.add(CAROUSEL_ITEM);
            target.setAttribute(IS_FULLY_VISIBLE, 'false');

            if (this.isPartiallyVisible(intersectionRatio)) {
                target.classList.remove(FULLY_VISIBLE);
                target.classList.add(PARTIALLY_VISIBLE);
                continue;
            }

            if (this.isCompletelyVisible(intersectionRatio)) {
                target.setAttribute(IS_FULLY_VISIBLE, 'true');
                target.classList.remove(PARTIALLY_VISIBLE);
                target.classList.add(FULLY_VISIBLE);
            }
        }
    }

    private watchItemsForLevelsOfVisibility(): void {
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
