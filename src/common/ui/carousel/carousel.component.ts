import { Component } from '@common/decorators';
import { isEmpty, isNil, isNull } from '@common/utils';
import type { VirtualScroll } from '../virtual-scroll';

import css from './carousel.component.css?inline';

const CAROUSEL_ITEM = 'carousel-item';
const FULLY_VISIBLE = 'fully-visible';
const IS_FULLY_VISIBLE = 'is-fully-visible';
const PARTIALLY_VISIBLE = 'partially-visible';

@Component({
    selector: 'disney-carousel',
})
export class CarouselComponent extends HTMLElement {
    private readonly element: ShadowRoot;
    private readonly contentObserver: MutationObserver;
    private readonly resizeObserver: ResizeObserver;

    private observer?: IntersectionObserver;

    constructor() {
        super();
        this.element = this.attachShadow({ mode: 'open' });
        this.contentObserver = new MutationObserver(this.watchItemsForLevelsOfVisibility.bind(this));
        this.resizeObserver = new ResizeObserver(this.watchItemsForLevelsOfVisibility.bind(this));
    }

    get carouselItems(): HTMLElement[] {
        return Array.from(this.content.children) as HTMLElement[];
    }

    get content(): HTMLElement {
        return this.slotElement.assignedElements()[0] as HTMLElement;
    }

    get slotElement(): HTMLSlotElement {
        return this.element.querySelector<HTMLSlotElement>('slot')!;
    }

    get virtualScroll(): VirtualScroll {
        return this.element.querySelector<VirtualScroll>('disney-virtual-scroll')!;
    }

    connectedCallback(): void {
        this.render();
        this.bindObservers();
        this.watchItemsForLevelsOfVisibility();
    }

    disconnectCallback(): void {
        this.observer?.disconnect();
        this.resizeObserver?.disconnect();
        this.contentObserver?.disconnect();
    }

    render(): void {
        this.element.innerHTML = `
            <style>${css}</style>
            <disney-virtual-scroll orientation="horizontal">
                <slot class="carousel-items" name="carousel-items" slot="content"></slot>
            </disney-virtual-scroll>
        `;
    }

    private bindObservers(): void {
        this.contentObserver.observe(this.content, { childList: true });
        this.resizeObserver.observe(this.slotElement);
        this.observer = new IntersectionObserver(this.setVisibilityStylingOnChange.bind(this), {
            root: this.virtualScroll.viewport,
            threshold: [0, 0.1, 0.2, 0.4, 0.5, 0.6, 0.7, 0.8, 1],
            rootMargin: '0px 0px 0px 0px',
        });
    }

    // @NOTE: The most outer element can sometimes not register as an element or
    //        even as one with actual "mass" (i.e., height & width), so this was
    //        written to serve as a tool to find a usable element much easier.
    //        This may be due to the nature of ShadowDOMs -- additional research
    //        is needed.
    private getTrueElement(item: Element): HTMLElement | null {
        if (isNil(item.shadowRoot)) return null;
        return item.shadowRoot.querySelector('div');
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
            threshold: [0, 0.1, 0.2, 0.4, 0.5, 0.6, 0.7, 0.8, 1],
        });
        if (isEmpty(this.carouselItems)) return;
        for (const item of this.carouselItems) {
            const targetElement: HTMLElement | null = this.getTrueElement(item);
            if (isNull(targetElement)) continue;
            this.observer?.observe(targetElement);
        }
    }
}
