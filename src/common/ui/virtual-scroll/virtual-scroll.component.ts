import { Component } from '@common/decorators';
import css from './virtual-scroll.component.css';

type ViewportSize = Record<'width' | 'height', number>;

// @TODO: Include means to remove/add elements based on viewport.
@Component({
    selector: 'disney-virtual-scroll',
})
export class VirtualScroll extends HTMLElement {
    private readonly element: ShadowRoot;

    private readonly resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
        for (const entry of entries) {
            if (entry.target !== this) continue;
            this.setViewportDimension('height', entry);
            this.setViewportDimension('width', entry);
            const onResize: CustomEvent = new CustomEvent('viewportResize', { detail: entry.contentRect });
            this.dispatchEvent(onResize);
        }
    });
    private readonly viewport: HTMLDivElement;
    private readonly size: ViewportSize = { width: 0, height: 0 };

    constructor() {
        super();
        this.element = this.attachShadow({ mode: 'open' });
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.viewport = document.querySelector<HTMLDivElement>('.virtual-scroll-viewport')!;
    }

    connectedCallback(): void {
        this.render();
        this.resizeObserver.observe(this);
    }

    disconnectCallback(): void {
        this.resizeObserver.disconnect();
    }

    render(): void {
        this.element.innerHTML = `
            <style>${css}</style>
            <div class="virtual-scroll-viewport">
                <div class="virtual-scroll-content">
                    <div class="virtual-scroll-track" style="will-change: transform; transform: translate3d(0px, 0px, 0px);">
                        <slot></slot>
                    </div>
                </div>
            </div>
        `;
    }

    private setViewportDimension(dimension: keyof ViewportSize, entry: ResizeObserverEntry): void {
        this.size[dimension] = entry.contentRect[dimension];
        this.viewport.style.setProperty(dimension, `${this.size[dimension]}px`);
    }
}
