import { elementFactory } from '@common/factories';
import { Component, isEmpty, isNil, isNull, isUndefined } from '@disney/common';
import { HomeStore } from '../../state-management/store';
import type { Collection, CollectionId, Content } from '../../types';

import '@common/ui/carousel';
import '../content-tile';
import css from './collection.component.css?inline';

export const INTERACTIVE_TILE = 'interactive-tile';

@Component({
    selector: 'disney-collection',
})
export class CollectionComponent extends HTMLElement {
    private readonly element: ShadowRoot;
    private contentTileObserver: IntersectionObserver = new IntersectionObserver(
        (entries: IntersectionObserverEntry[]): void => {
            let index = 0;
            const FULLY_VISIBLE = 'fully-visible-tile';
            const PARTIALLY_VISIBLE = 'partially-visible-tile';
            for (const entry of entries) {
                const component: HTMLElement = this.getHostComponent(entry.target as HTMLElement);
                component.classList.remove(INTERACTIVE_TILE);
                component.removeAttribute(INTERACTIVE_TILE);

                const image: HTMLImageElement = entry.target.querySelector('img') as HTMLImageElement;
                image.classList.remove(FULLY_VISIBLE, PARTIALLY_VISIBLE);

                if (!entry.isIntersecting) continue;

                if (this.isPartiallyVisible(entry.intersectionRatio)) {
                    image.classList.add(PARTIALLY_VISIBLE);
                }
                if (this.isCompletelyVisible(entry.intersectionRatio)) {
                    index++;
                    component.setAttribute(INTERACTIVE_TILE, index.toString());
                    image.classList.add(FULLY_VISIBLE, INTERACTIVE_TILE);
                }
            }
        },
        {
            threshold: 0,
            // @NOTE: This is just a quick way to make sure it's only the furthest
            //        tiles on the side (and not those partially seen on the
            //        bottom) that are faded.
            rootMargin: '0px 0px 0px 0px',
        },
    );

    getHostComponent(target: HTMLElement): HTMLElement {
        return (target?.parentNode?.parentNode?.parentNode as ShadowRoot)?.host as HTMLElement;
    }

    private isPartiallyVisible(visibilityPercentage: number): boolean {
        return visibilityPercentage >= 0 && visibilityPercentage < 1;
    }

    private isCompletelyVisible(visibilityPercentage: number): boolean {
        return visibilityPercentage === 1;
    }

    constructor(private readonly store: HomeStore = new HomeStore()) {
        super();
        this.element = this.attachShadow({ mode: 'open' });
    }

    private collectionId?: CollectionId;
    private collection?: Readonly<Collection>;

    connectedCallback(): void {
        const collectionId: CollectionId | null = this.getAttribute('collection-id');
        if (isNull(collectionId)) {
            console.error('Collection ID is required');
            return this.hideCollection();
        }
        this.collectionId = collectionId;
        this.render();
        this.watchContentTiles();
    }

    render(): void {
        this.collection = this.store.getCollection(this.collectionId as string);
        if (isNil(this.collection) || isUndefined(this.collection.content)) {
            return this.hideCollection();
        }
        this.createTemplate(this.collection.title, css);
        this.renderContentTiles(this.collection.content);
    }

    private createTemplate(title: string, styles: string): void {
        this.element.innerHTML = `
            <style>${styles}</style>
            <h4>${title}</h4>
            <div class="collection-content">
                <disney-carousel></disney-carousel>
            </div>
        `;
    }

    private getCarousel(): HTMLElement {
        return this.element.querySelector('disney-carousel') as HTMLElement;
    }

    private hideCollection(): void {
        this.style.display = 'none';
        this.innerHTML = '';
    }

    private renderContentTiles(content: ReadonlyArray<Content>): void {
        const carousel: HTMLElement = this.getCarousel();
        const indexAttribute: string | null = this.getAttribute('collection-index') ?? '0';
        const collectionIndex: number = isEmpty(indexAttribute) ? 0 : parseInt(indexAttribute);

        carousel.replaceChildren(
            ...content.map<HTMLElement>(({ title, image }: Readonly<Content>): HTMLElement => {
                const contentTile: HTMLElement = elementFactory({
                    attributes: [`content-title: ${title}`, `collection-index: ${collectionIndex + 1}`],
                    tagName: 'disney-content-tile',
                });
                // @TODO: The elementFactory() function cannot handle URLs (https://)
                //        at this time, because of the colon parsing.
                contentTile.setAttribute('content-image-src', image);
                return contentTile;
            }),
        );
    }

    private watchContentTiles(): void {
        const carousel: HTMLElement = this.getCarousel();
        const contentTiles = carousel.querySelectorAll('disney-content-tile');
        contentTiles?.forEach((contentTile: Element): void => {
            const observedElement: Element | null | undefined =
                contentTile.shadowRoot?.querySelector('.content-tile-link');
            if (isNil(observedElement)) return;
            this.contentTileObserver.observe(observedElement);
        });
    }
}
