import { Component } from '@common/decorators';
import { clamp, isNull } from '../../utils';
import htmlFileTemplate from './carousel.component.html?raw';

import './carousel.component.css';

const CLICK_EVENT = 'click';
const SIZE_OF_SLIDE_MOVEMENT = 250;

@Component({
    selector: 'disney-carousel',
})
export class CarouselComponent extends HTMLElement {
    constructor() {
        super();
    }

    private next: HTMLButtonElement | null = null;
    private previous: HTMLButtonElement | null = null;
    private carouselItems: HTMLElement | null = null;
    private originalBody: string | null = null;

    connectedCallback(): void {
        this.render();
    }

    render(): void {
        this.originalBody = new DOMParser().parseFromString(this.innerHTML, 'text/html').body.innerHTML;
        this.innerHTML = htmlFileTemplate;
        const template: HTMLElement | null = document.querySelector('template');
        if (!this.hasValidContentNode(template)) {
            console.error('Carousel template was not found!');
            return;
        }
        this.innerHTML = template.innerHTML;
        this.getEssentialElements();
        this.loadCarouselEvents();
        this.reinsertContent();
    }

    private getEssentialElements(): void {
        this.next = this.querySelector<HTMLButtonElement>('.carousel-next');
        this.previous = this.querySelector<HTMLButtonElement>('.carousel-previous');
        this.carouselItems = this.querySelector<HTMLElement>('.carousel-items');
    }

    private loadCarouselEvents(): void {
        if (isNull(this.next) || isNull(this.previous) || isNull(this.carouselItems)) {
            console.error('Essential carousel elements were not found!');
            return;
        }

        this.previous.addEventListener(CLICK_EVENT, this.goToPreviousSlide);
        this.next.addEventListener(CLICK_EVENT, this.goToNextSlide);
    }

    private goToNextSlide = (): void => {
        if (isNull(this.carouselItems)) return;
        const moveBy: number = clamp(this.carouselItems.scrollLeft + SIZE_OF_SLIDE_MOVEMENT, 0);
        this.carouselItems.scrollLeft += moveBy;
    };

    private goToPreviousSlide = (): void => {
        if (isNull(this.carouselItems)) return;
        this.carouselItems.scrollLeft -= SIZE_OF_SLIDE_MOVEMENT;
    };

    private hasValidContentNode(template: unknown): template is HTMLTemplateElement {
        return !isNull(template) && template instanceof HTMLTemplateElement;
    }

    private reinsertContent(): void {
        if (isNull(this.originalBody) || isNull(this.carouselItems)) return;
        this.carouselItems.innerHTML = this.originalBody;
    }
}
