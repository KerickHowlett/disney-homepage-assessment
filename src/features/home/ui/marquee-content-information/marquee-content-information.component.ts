import { changeDetectedBetween, Component, isEmpty, isNil, isNull } from '@disney/common';

import css from './marquee-content-information.component.css?inline';

type DisplayStyle = 'none' | 'inline-block';

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
        return ['content-title', 'title-treatment-image', 'rating'];
    }

    get contentTitleImageElement(): HTMLImageElement {
        return this.element.querySelector<HTMLImageElement>('.title-image')!;
    }

    get contentRatingElement(): HTMLParagraphElement {
        return this.element.querySelector<HTMLParagraphElement>('.content-rating')!;
    }

    get failsafeTitleElement(): HTMLHeadingElement {
        return this.element.querySelector<HTMLHeadingElement>('.failsafe-title')!;
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (isNil(this.contentTitleImageElement) || !changeDetectedBetween(oldValue, newValue)) return;
        switch (name) {
            case 'content-title':
                return this.setContentTitle(newValue);
            case 'title-treatment-image':
                this.setTitleTreatmentImage(newValue);
                break;
            case 'rating':
                this.setRating(newValue);
                break;
        }
    }

    connectedCallback(): void {
        this.render();
        this.bindImageEventHandlers();
    }

    render(): void {
        this.element.innerHTML = `
            <style>${css}</style>
            <div id="content-title" class="content-title">
                <img loading="eager" id="title-image" class="title-image">
                <h2 id="failsafe-title" class="failsafe-title" style="display: none;"></h2>
            </div>
            <div id="content-preview-metadata" class="content-preview-metadata">
                <h3 id="content-rating" class="content-rating" style="display: none;"></h3>
            </div>
        `;
    }

    private bindImageEventHandlers(): void {
        this.contentTitleImageElement.onload = this.onImageLoad.bind(this);
        this.contentTitleImageElement.onerror = this.onImageError.bind(this);
    }

    private onImageError(): void {
        this.contentTitleImageElement.style.display = 'none';
        this.failsafeTitleElement.style.display = 'block';
    }

    private onImageLoad(): void {
        this.contentTitleImageElement.style.display = 'block';
        this.failsafeTitleElement.style.display = 'none';
    }

    private setContentTitle(title: string): void {
        if (isNull(this.contentTitleImageElement)) return;
        this.failsafeTitleElement.textContent = title;
        this.contentTitleImageElement.alt = title ?? '';
        this.contentTitleImageElement.ariaLabel = title ?? '';
    }

    private setRating(rating: string | null): void {
        this.contentRatingElement.innerText = rating ?? '';
        this.toggleDisplayBasedOnAttributeValue(rating, this.contentRatingElement);
    }

    private setTitleTreatmentImage(image: string): void {
        this.contentTitleImageElement.src = image ?? '';
        this.toggleDisplayBasedOnAttributeValue(image, this.contentTitleImageElement);
    }

    private toggleDisplayBasedOnAttributeValue(value: string | null, element: HTMLElement): void {
        const displayStyle: DisplayStyle = isNull(value) || isEmpty(value) ? 'none' : 'inline-block';
        element.style.display = displayStyle;
    }
}
