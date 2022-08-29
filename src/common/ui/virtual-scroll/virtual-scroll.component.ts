import { Component } from '@common/decorators';
import { clamp, isNil, isNull } from '@common/utils';

import css from './virtual-scroll.component.css';

type Axis = 'x' | 'y';
type Dimension = 'width' | 'height';
type Direction = Horizontal | Vertical;
type Horizontal = 'LEFT' | 'RIGHT';
type Orientation = 'horizontal' | 'vertical';
type PositionByAxis = Record<'x' | 'y', number>;
type Vertical = 'UP' | 'DOWN';

// @TODO: Include means to remove/add elements based on viewport for better
//        better performance.
@Component({
    selector: 'disney-virtual-scroll',
})
export class VirtualScroll extends HTMLElement {
    private readonly contentObserver: MutationObserver = new MutationObserver(this.updateVirtualScroll.bind(this));
    private readonly resizeObserver: ResizeObserver = new ResizeObserver(this.updateVirtualScroll.bind(this));
    private readonly element: ShadowRoot;

    private intersectionObserver?: IntersectionObserver;
    private position: PositionByAxis = {
        x: 0,
        y: 0,
    };
    private orientation: Orientation = 'vertical';

    private partiallyVisibleRatio = 0;

    constructor() {
        super();
        this.element = this.attachShadow({ mode: 'open' });
    }

    get content(): HTMLElement {
        return this.slotElement.assignedElements()[0] as HTMLElement;
    }

    get items(): HTMLElement[] {
        const carouselItemsPlaceholder: HTMLElement = this.slotElement.assignedElements()[0] as HTMLElement;
        return Array.from(carouselItemsPlaceholder.children) as HTMLElement[];
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
        this.setOrientation();
        this.render();
        this.bindEvents();
    }

    disconnectCallback(): void {
        this.unbindEvents();
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
        this.observeEachItem();
        this.setTrackHeight();
    }

    private bindEvents(): void {
        this.contentObserver.observe(this.content, { childList: true });
        this.addEventListener('focusin', this.scrollOnFocus.bind(this), true);
        this.resizeObserver.observe(this.viewport);
        this.watchForPartiallyVisibleRows();
    }

    private isPartiallyVisible(visibilityPercentage: number): boolean {
        return visibilityPercentage > 0 && visibilityPercentage < 1;
    }

    private isValidOrientation(orientation: string | null): orientation is Orientation {
        if (isNull(orientation)) return false;
        return orientation === 'horizontal' || orientation === 'vertical';
    }

    private getPartiallyVisibleRatio(entries: IntersectionObserverEntry[]): void {
        let ratioForPartiallyVisibleItem = 0;
        for (const { intersectionRatio } of entries) {
            if (!this.isPartiallyVisible(intersectionRatio)) continue;
            ratioForPartiallyVisibleItem = intersectionRatio;
        }
        this.partiallyVisibleRatio = ratioForPartiallyVisibleItem;
    }

    private getTranslate3dProperty(axis: Axis, newPosition: number): string {
        if (axis === 'x') return `translate3d(${newPosition}px, 0px, 0px)`;
        return `translate3d(0px, ${newPosition}px, 0px)`;
    }

    private isLeftOrUp(direction: Direction): boolean {
        return direction === 'LEFT' || direction === 'UP';
    }

    private moveScroll(direction: Direction, itemMeasurement: number): void {
        const positionChange: number = this.isLeftOrUp(direction) ? itemMeasurement : -1 * itemMeasurement;
        const minPosition: number = -1 * itemMeasurement * this.items.length;
        const axis: Axis = this.getCorrectAxis(direction);
        this.position[axis] = clamp(this.position[axis] + positionChange, minPosition, 0);
        this.track.style.transform = this.getTranslate3dProperty(axis, this.position[axis]);
    }

    private getCorrectAxis(direction: Direction): Axis {
        return direction === 'LEFT' || direction === 'RIGHT' ? 'x' : 'y';
    }

    private setOrientation(): void {
        const orientation: string | null = this.getAttribute('orientation');
        this.orientation = this.isValidOrientation(orientation) ? orientation : 'vertical';
    }

    private setTrackHeight(): void {
        const dimension: Dimension = this.orientation === 'vertical' ? 'height' : 'width';
        const itemDimension: number = this.items[0]?.getBoundingClientRect()[dimension] || 0;
        const maxMeasurementForDimension: number = itemDimension * this.items.length;
        const maxMeasurementInPixels = `${maxMeasurementForDimension}px`;
        this.track.style[dimension] = maxMeasurementInPixels;
        this.slotElement.style[dimension] = maxMeasurementInPixels;
    }

    private scrollOnFocus(event: FocusEvent): void {
        if (isNull(event.target)) return;

        const item: HTMLElement | null = event.target as HTMLElement;
        if (isNil(item)) return;

        if (this.orientation === 'vertical') {
            return this.scrollVerticallyOnFocus(item);
        }
        if (this.orientation === 'horizontal') {
            return this.scrollHorizontallyOnFocus(item);
        }
        console.error('Invalid orientation was set.');
    }

    private scrollHorizontallyOnFocus(item: HTMLElement): void {
        const { left: leftOfItem, right: rightOfItem, width: itemWidth } = item.getBoundingClientRect();
        const { left: leftOfViewport } = this.viewport.getBoundingClientRect();
        if (leftOfItem <= leftOfViewport) {
            return this.moveScroll('LEFT', itemWidth);
        }
        const widthOfPartiallyVisibleItem: number = itemWidth * this.partiallyVisibleRatio;
        if (rightOfItem > leftOfViewport + this.viewport.offsetWidth - widthOfPartiallyVisibleItem) {
            return this.moveScroll('RIGHT', itemWidth);
        }
    }

    private scrollVerticallyOnFocus(item: HTMLElement): void {
        const { bottom: bottomOfRow, height: itemHeight, top: topOfRow } = item.getBoundingClientRect();
        const { top: topOfViewport } = this.viewport.getBoundingClientRect();
        if (topOfRow <= topOfViewport) {
            return this.moveScroll('UP', itemHeight);
        }
        const partiallyVisibleHeight: number = itemHeight * this.partiallyVisibleRatio;
        if (bottomOfRow > topOfViewport + this.viewport.offsetHeight - partiallyVisibleHeight) {
            return this.moveScroll('DOWN', itemHeight);
        }
    }

    private observeEachItem(): void {
        this.items.forEach((item: HTMLElement): void => {
            if (isNull(item)) return;
            this.intersectionObserver!.observe(item);
        });
    }

    private unbindEvents(): void {
        this.resizeObserver.disconnect();
        this.contentObserver.disconnect();
        this.intersectionObserver?.disconnect();
        this.removeEventListener('focusin', this.scrollOnFocus.bind(this), true);
    }

    private watchForPartiallyVisibleRows(): void {
        this.intersectionObserver = new IntersectionObserver(this.getPartiallyVisibleRatio.bind(this), {
            root: this.viewport,
            threshold: [0, 0.2, 0.4, 0.5, 0.6, 0.8, 1],
        });
    }
}
