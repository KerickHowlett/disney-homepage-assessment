import { Component } from '@disney/common';
// import { Component, elementFactory } from '@disney/common';

import css from './marquee-content-information.component.css?inline';

@Component({
    selector: 'disney-marquee-content-information',
})
export class MarqueeContentInformationComponent extends HTMLElement {
    private readonly element: ShadowRoot;

    constructor() {
        super();
        this.element = this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes(): string[] {
        return ['content-title', 'title-treatment-layer', 'rating'];
    }

    get contentPreviewDisplayElement(): HTMLElement {
        return this.element.getElementById('content-preview-display')!;
    }

    get contentTitle(): string {
        return this.getAttribute('content-title')!;
    }

    get rating(): string | null {
        return this.getAttribute('rating');
    }

    get titleTreatmentImage(): string {
        return this.getAttribute('title-treatment-image')!;
    }

    // attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    //    if (name === 'video' && !changeDetectedBetween(oldValue, newValue)) return;
    // }

    connectedCallback(): void {
        this.render();
    }

    render(): void {
        this.element.innerHTML = `
            <style>${css}</style>
            <div id="content-information" class="content-information">
                <div id="content-title" class="content-title"></div>
                <p id="content-rating" class="content-rating"></p>
            </div>
        `;
    }

    // private createFailsafeTitleElement(): HTMLHeadingElement {
    //     return elementFactory({
    //         body: this.contentTitle,
    //         classes: ['failsafe-title'],
    //         id: 'failsafe-title',
    //         tagName: 'h2',
    //     });
    // }

    // private createTitleTreatmentImageElement(): HTMLImageElement {
    //     return elementFactory({
    //         attributes: {
    //             alt: this.contentTitle,
    //             'failsafe-src': '/default-content-tile.jpeg',
    //             is: 'disney-image',
    //             loading: 'eager',
    //             src: this.titleTreatmentImage,
    //             tabindex: '-1',
    //         },
    //         classes: ['title-image'],
    //         id: 'title-image',
    //         tagName: 'img',
    //     });
    // }
}
