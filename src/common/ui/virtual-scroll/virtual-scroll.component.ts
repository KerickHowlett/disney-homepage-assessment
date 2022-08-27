import { Component } from '@common/decorators';
import { clamp, isEmpty, isNil, isNull, isUndefined } from '@common/utils';

import css from './virtual-scroll.component.css';

type Vertical = 'UP' | 'DOWN';

// @TODO: Include means to remove/add elements based on viewport.
@Component({
    selector: 'disney-virtual-scroll',
})
export class VirtualScroll extends HTMLElement {
    private readonly contentObserver: MutationObserver = new MutationObserver(this.updateVirtualScroll.bind(this));
    private readonly resizeObserver: ResizeObserver = new ResizeObserver(this.updateVirtualScroll.bind(this));
    private readonly element: ShadowRoot;

    private intersectionObserver?: IntersectionObserver;
    private rows: HTMLElement[] = [];

    private heightOfPartiallyVisibleRow = 0;
    private rowHeight = 0;
    private totalRows = 0;
    private yPosition = 0;

    constructor() {
        super();
        this.element = this.attachShadow({ mode: 'open' });
    }

    get content(): HTMLElement {
        return this.slotElement.assignedElements()[0] as HTMLElement;
    }

    get slotElement(): HTMLSlotElement {
        return this.element.querySelector<HTMLSlotElement>('slot')!;
    }

    get track(): HTMLDivElement {
        return this.element.querySelector<HTMLDivElement>('.virtual-scroll-track')!;
    }

    get viewport(): HTMLDivElement {
        return this.element.querySelector<HTMLDivElement>('.virtual-scroll-viewport')!;
    }

    connectedCallback(): void {
        this.render();
        this.bindEvents();
    }

    disconnectCallback(): void {
        this.resizeObserver.disconnect();
        this.contentObserver.disconnect();
        this.removeEventListener('focusin', this.scrollOnFocus.bind(this), true);
    }

    render(): void {
        this.element.innerHTML = `
            <style>${css}</style>
            <div class="virtual-scroll-viewport">
                <div class="virtual-scroll-track" style="transform: translate3d(0px, 0px, 0px);">
                    <slot name="content"></slot>
                </div>
            </div>
        `;
    }

    updateVirtualScroll(): void {
        this.measureVirtualScrollElements();
        this.setTrackHeight();
    }

    private bindEvents(): void {
        this.contentObserver.observe(this.content, { childList: true });
        this.addEventListener('focusin', this.scrollOnFocus.bind(this), true);
        this.resizeObserver.observe(this.viewport);
        this.watchForPartiallyVisibleRows();
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

    private isPartiallyVisible(visibilityPercentage: number): boolean {
        return visibilityPercentage > 0 && visibilityPercentage < 1;
    }

    private moveScroll(direction: Vertical): void {
        const positionChange: number = direction === 'UP' ? this.rowHeight : -1 * this.rowHeight;
        const minPosition: number = -1 * this.rowHeight * this.totalRows;
        this.yPosition = clamp(this.yPosition + positionChange, minPosition, 0);
        this.track.style.transform = `translate3d(0px, ${this.yPosition}px, 0px)`;
    }

    private measureVirtualScrollElements(): void {
        const carouselItemsPlaceholder: HTMLElement = this.slotElement.assignedElements()[0] as HTMLElement;
        this.rows = Array.from(carouselItemsPlaceholder.children) as HTMLElement[];
        this.totalRows = this.rows.length;
        if (isEmpty(this.rows)) return;

        const firstTargetElement: HTMLElement | undefined = this.rows[0];
        if (isUndefined(firstTargetElement)) return;

        this.rowHeight = firstTargetElement?.offsetHeight || 0;
    }

    private setTrackHeight(): void {
        const maxHeight: number = this.rowHeight * this.totalRows;
        this.track.style.height = `${maxHeight}px`;
        this.slotElement.style.height = `${maxHeight}px`;
    }

    private scrollOnFocus(event: FocusEvent): void {
        if (isNull(event.target)) return;

        const row: HTMLElement | null = this.getTrueElement(event.target as HTMLElement);
        if (isNil(row)) return;

        const { bottom: bottomOfRow, top: topOfRow } = row.getBoundingClientRect();
        const { top: topOfViewport } = this.viewport.getBoundingClientRect();
        if (topOfRow <= topOfViewport) {
            return this.moveScroll('UP');
        }
        if (bottomOfRow > topOfViewport + this.viewport.offsetHeight - this.heightOfPartiallyVisibleRow) {
            return this.moveScroll('DOWN');
        }
    }

    private measurePartiallyVisibleRow(entries: IntersectionObserverEntry[]): void {
        let ratioForPartiallyVIsibleItem = 0;
        for (const { intersectionRatio } of entries) {
            if (!this.isPartiallyVisible(intersectionRatio)) continue;
            ratioForPartiallyVIsibleItem = intersectionRatio;
        }
        this.heightOfPartiallyVisibleRow = ratioForPartiallyVIsibleItem * this.rowHeight;
    }

    private watchForPartiallyVisibleRows(): void {
        this.rows.forEach((item: HTMLElement): void => {
            const targetElement: HTMLElement | null = this.getTrueElement(item);
            if (isNull(targetElement)) return;
            this.intersectionObserver!.observe(targetElement);
        });
        this.intersectionObserver = new IntersectionObserver(this.measurePartiallyVisibleRow.bind(this), {
            root: this.viewport,
            threshold: [0, 0.2, 0.4, 0.5, 0.6, 0.8, 1],
        });
    }
}
