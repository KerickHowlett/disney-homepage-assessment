import { Component } from '@common/decorators';
import { clamp, isNil, isNull, isUndefined } from '@common/utils';

import css from './virtual-scroll.component.css';

const DEFAULT_ORIENTATION = 'vertical';

const LEFT_KEYS: string[] = ['ArrowLeft', 'KeyA', 'Numpad4'];
const RIGHT_KEYS: string[] = ['ArrowRight', 'KeyD', 'Numpad6'];
const HORIZONTAL_KEYS: string[] = [...LEFT_KEYS, ...RIGHT_KEYS];

type Axis = 'x' | 'y';
type Dimension = 'width' | 'height';
type Direction = Horizontal | Vertical;
type Horizontal = 'LEFT' | 'RIGHT';
type Orientation = 'horizontal' | 'vertical';
type PositionByAxis = Record<'x' | 'y', number>;
type ScrollOnFocusMethods = (item: HTMLElement) => void;
type ScrollOnFocusMethodsMap = Readonly<Record<Orientation, ScrollOnFocusMethods>>;
type Vertical = 'UP' | 'DOWN';

// @TODO: Include means to remove/add elements based on DOMRect of item(s) and
//        immediate parent viewport for better better performance.
@Component({
    selector: 'disney-virtual-scroll',
})
export class VirtualScroll extends HTMLElement {
    private readonly contentObserver: MutationObserver = new MutationObserver(this.updateVirtualScroll.bind(this));
    private readonly resizeObserver: ResizeObserver = new ResizeObserver(this.updateVirtualScroll.bind(this));
    private readonly element: ShadowRoot;
    private readonly scrollOnFocusMethod: ScrollOnFocusMethodsMap = {
        vertical: (item: HTMLElement) => this.scrollVerticallyOnFocus(item),
        horizontal: (item: HTMLElement) => this.scrollHorizontallyOnFocus(item),
    };

    private scrollPosition: PositionByAxis = {
        x: 0,
        y: 0,
    };
    private orientation: Orientation = DEFAULT_ORIENTATION;

    constructor() {
        super();
        this.element = this.attachShadow({ mode: 'open' });
    }

    get content(): HTMLElement {
        return this.slotElement.assignedElements()[0] as HTMLElement;
    }

    get items(): HTMLElement[] {
        if (this.content.tagName !== 'SLOT') {
            return Array.from(this.content.children) as HTMLElement[];
        }
        return Array.from(this.nestedContent.children) as HTMLElement[];
    }

    get slotElement(): HTMLSlotElement {
        return this.element.querySelector<HTMLSlotElement>('slot')!;
    }

    // @NOTE: This is a quick & temporary workaround to get the virtual scroll
    //        to work correctly with the virtual scroll component. The best
    //         course of action in the future would be to make this more dynamic.
    get nestedContent(): HTMLSlotElement {
        return (this.content as HTMLSlotElement).assignedNodes()[0] as HTMLSlotElement;
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
        this.setTrackAndSlotDimensions();
        this.setStylePropertiesIfHorizontal();
    }

    private bindEvents(): void {
        this.resizeObserver.observe(this.viewport);
        this.contentObserver.observe(this.content, { childList: true });
        this.addEventListener('focusin', this.scrollOnFocus.bind(this), true);
    }

    private isValidOrientation(orientation: string | null): orientation is Orientation {
        if (isNull(orientation)) return false;
        return orientation === 'horizontal' || orientation === 'vertical';
    }

    private getCorrectAxis(direction: Direction): Axis {
        return direction === 'LEFT' || direction === 'RIGHT' ? 'x' : 'y';
    }

    private getTranslate3dProperty(axis: Axis, newPosition: number): string {
        if (axis === 'x') return `translate3d(${newPosition}px, 0px, 0px)`;
        return `translate3d(0px, ${newPosition}px, 0px)`;
    }

    private horizontalKeyWasPressed(): boolean {
        const latestEvent: Event | KeyboardEvent | undefined = window.event;
        if (isUndefined(latestEvent) || !this.isKeyboardEvent(latestEvent)) return false;
        return HORIZONTAL_KEYS.includes(latestEvent.code);
    }

    private isKeyboardEvent(event: Event): event is KeyboardEvent {
        return event instanceof KeyboardEvent;
    }

    private isLeftOrUp(direction: Direction): boolean {
        return direction === 'LEFT' || direction === 'UP';
    }

    private moveScroll(direction: Direction, itemMeasurement: number): void {
        const positionChange: number = this.isLeftOrUp(direction) ? itemMeasurement : -1 * itemMeasurement;
        const minPosition: number = -1 * itemMeasurement * this.items.length;
        const axis: Axis = this.getCorrectAxis(direction);

        this.scrollPosition[axis] = clamp(this.scrollPosition[axis] + positionChange, minPosition, 0);
        this.track.style.transform = this.getTranslate3dProperty(axis, this.scrollPosition[axis]);
    }

    private setOrientation(): void {
        const orientation: string | null = this.getAttribute('orientation');
        this.orientation = this.isValidOrientation(orientation) ? orientation : 'vertical';
    }

    private setTrackAndSlotDimensions(): void {
        const dimension: Dimension = this.orientation === 'vertical' ? 'height' : 'width';
        const itemDimension: number = this.items[0]?.getBoundingClientRect()[dimension] || 0;

        const maxMeasurementForDimension: number = itemDimension * this.items.length;
        const maxMeasurementInPixels = `${maxMeasurementForDimension}px`;

        this.track.style[dimension] = maxMeasurementInPixels;
        this.slotElement.style[dimension] = maxMeasurementInPixels;
    }

    private setStylePropertiesIfHorizontal(): void {
        if (this.orientation !== 'horizontal') return;
        const HORIZONTAL_CLASS = 'horizontal';
        this.viewport.classList.add(HORIZONTAL_CLASS);
        this.track.classList.add(HORIZONTAL_CLASS);
    }

    private scrollOnFocus(event: FocusEvent): void {
        if (isNull(event.target)) return;

        const item: HTMLElement | null = event.target as HTMLElement;
        if (isNil(item)) return;

        this.scrollOnFocusMethod[this.orientation](item);
    }

    // @NOTE: This and the following "onFocus" scroll methods could probably be
    //        combined into a single method, but I'm keeping them separate to
    //        make it easier to understand what's going on without needing to add
    //        an additional layer of potentially confusing abstraction.
    //        This will also better help prevent "crossing the streams" between
    //        horizontal and vertical navigation actions.
    private scrollHorizontallyOnFocus(item: HTMLElement): void {
        if (!this.horizontalKeyWasPressed()) return;

        const { left: leftOfItem, right: rightOfItem, width: itemWidth } = item.getBoundingClientRect();
        const { left: leftOfViewport } = this.viewport.getBoundingClientRect();
        if (leftOfItem <= leftOfViewport) {
            requestAnimationFrame(this.moveScroll.bind(this, 'LEFT', itemWidth));
            return;
        }

        if (rightOfItem > leftOfViewport + this.viewport.offsetWidth) {
            requestAnimationFrame(this.moveScroll.bind(this, 'RIGHT', itemWidth));
        }
    }

    private scrollVerticallyOnFocus(item: HTMLElement): void {
        const { bottom: bottomOfRow, height: itemHeight, top: topOfRow } = item.getBoundingClientRect();
        const { top: topOfViewport } = this.viewport.getBoundingClientRect();
        if (topOfRow <= topOfViewport) {
            requestAnimationFrame(this.moveScroll.bind(this, 'UP', itemHeight));
            return;
        }

        if (bottomOfRow > topOfViewport + this.viewport.offsetHeight) {
            requestAnimationFrame(this.moveScroll.bind(this, 'DOWN', itemHeight));
        }
    }

    private unbindEvents(): void {
        this.resizeObserver.disconnect();
        this.contentObserver.disconnect();
        this.removeEventListener('focusin', this.scrollOnFocus.bind(this), true);
    }
}
