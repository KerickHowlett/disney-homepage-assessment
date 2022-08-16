import { Component } from '@common/decorators';
import { isEmpty, isNil, isNull } from '../../utils';

import htmlFileTemplate from './carousel.component.html?raw';

import './carousel.component.css';

@Component({
    selector: 'disney-carousel',
})
export class CarouselComponent extends HTMLElement {
    constructor(private readonly parser: DOMParser = new DOMParser()) {
        super();
    }

    connectedCallback(): void {
        this.render();
    }

    render(): void {
        const originalBody: string = this.getOriginalChildElements();
        this.setChildrenElementsWith(htmlFileTemplate);
        this.setupTemplate();
        this.wrapCarouselAroundChildrenElements(originalBody);
    }

    private getOriginalChildElements(): string {
        const originalChildrenElements: Document = this.parser.parseFromString(this.innerHTML, 'text/html');
        return originalChildrenElements.body.innerHTML;
    }

    private setChildrenElementsWith(html?: string): void {
        this.innerHTML = isNil(html) ? '' : html;
    }

    private setupTemplate(): void {
        const template: HTMLTemplateElement | null = document.querySelector<HTMLTemplateElement>('template');
        const { innerHTML } = this.templateExists(template) ? template : document.createElement('template');
        this.setChildrenElementsWith(innerHTML);
    }

    private templateExists(template: unknown): template is HTMLTemplateElement {
        return !isNull(template) && template instanceof HTMLTemplateElement;
    }

    private wrapCarouselAroundChildrenElements(originalBody: string): void {
        const carouselItems: HTMLElement | null = this.querySelector<HTMLElement>('.carousel-items');
        if (isEmpty(originalBody) || isNull(carouselItems)) {
            this.style.display = 'none';
            console.error('Essential carousel elements were not found.');
            return;
        }

        carouselItems.innerHTML = originalBody;
    }
}
