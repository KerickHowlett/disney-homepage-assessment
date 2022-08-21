import { Component } from '@common/decorators';

import css from './carousel.component.css?inline';

@Component({
    selector: 'disney-carousel',
})
export class CarouselComponent extends HTMLElement {
    private readonly element: ShadowRoot;

    constructor() {
        super();
        this.element = this.attachShadow({ mode: 'open' });
    }

    connectedCallback(): void {
        this.render();
    }

    render(): void {
        this.element.innerHTML = `
            <style>${css}</style>
            <div class="carousel-container">
                <div class="carousel-items">
                    <div class="carousel-track">
                        <slot></slot>
                    </div>
                </div>
            </div>
        `;
    }
}
