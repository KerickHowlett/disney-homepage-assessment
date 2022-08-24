import { Component } from '@common/decorators';
import { isEmpty, isNil, isNull } from '@common/utils';

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
    private readonly element: ShadowRoot;
    private observer?: IntersectionObserver;
    private carouselItems: HTMLElement[] = [];

    constructor() {
        super();
        this.element = this.attachShadow({ mode: 'open' });
    }

    get carouselTrack(): HTMLDivElement {
        return this.element.querySelector<HTMLDivElement>(`.${CAROUSEL_TRACK}`)!;
    }

    get slotElement(): HTMLSlotElement {
        return this.element.querySelector<HTMLSlotElement>('slot')!;
    }

    get targetElement(): string {
        const attribute: string | null = this.getAttribute(WATCH_TARGET);
        if (isNull(attribute) || isEmpty(attribute)) return 'div';
        return attribute;
    }

    update(): void {
        const carouselItems: HTMLElement = this.slotElement.assignedElements()[0] as HTMLElement;
        this.carouselItems = Array.from(carouselItems.children) as HTMLElement[];
        this.watchItems();
    }

    connectedCallback(): void {
        this.render();
        this.createSlotListener();
        this.watchItems();
    }

    disconnectCallback(): void {
        this.observer?.disconnect();
    }

    render(): void {
        this.element.innerHTML = `
            <style>${css}</style>
            <div class="carousel-viewport">
                <div class="carousel-track">
                    <slot name="carousel-items"></slot>
                </div>
            </div>
        `;
    }

    private isCompletelyVisible(visibilityPercentage: number): boolean {
        return visibilityPercentage === 1;
    }

    private isPartiallyVisible(visibilityPercentage: number): boolean {
        return visibilityPercentage > 0 && visibilityPercentage < 1;
    }

    private onObserverChange(entries: IntersectionObserverEntry[]): void {
        let index = 0;
        for (const { target, isIntersecting, intersectionRatio } of entries) {
            if (!isIntersecting) {
                target.classList.remove(FULLY_VISIBLE, PARTIALLY_VISIBLE);
                target.classList.remove(INTERACTIVE_TILE);
                target.removeAttribute(INTERACTIVE_TILE);
            }
            if (this.isPartiallyVisible(intersectionRatio)) {
                target.classList.add(PARTIALLY_VISIBLE);
            }
            if (this.isCompletelyVisible(intersectionRatio)) {
                index++;
                target.setAttribute(INTERACTIVE_TILE, index.toString());
                target.classList.add(FULLY_VISIBLE, INTERACTIVE_TILE);
            }
        }
    }

    private watchItems(): void {
        this.observer = new IntersectionObserver(this.onObserverChange.bind(this), {
            root: this.carouselTrack,
            threshold: [0, 0.2, 0.4, 0.5, 0.6, 0.8, 1],
        });
        this.carouselItems.forEach((item: Element): void => {
            const itemRoot: HTMLElement | ShadowRoot = isNil(item.shadowRoot) ? (item as HTMLElement) : item.shadowRoot;
            const targetElement: HTMLElement | null = itemRoot.querySelector(this.targetElement);
            if (isNull(targetElement)) {
                console.error('Could not find target element for carousel item.');
                return;
            }
            targetElement.classList.add(CAROUSEL_ITEM);
            this.observer!.observe(targetElement);
        });
    }

    private createSlotListener(): void {
        this.slotElement.addEventListener('slotchange', this.update.bind(this));
    }
}
