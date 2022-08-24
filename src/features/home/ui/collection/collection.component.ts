import { elementFactory } from '@common/factories';
import { Component, isEmpty, isNil, isNull, isUndefined } from '@disney/common';
import { HomeStore } from '../../state-management/store';
import type { Collection, CollectionId, Content } from '../../types';

import css from './collection.component.css?inline';

import '@common/ui/carousel';
import '../content-tile';

export const INTERACTIVE_TILE = 'interactive-tile';

@Component({
    selector: 'disney-collection',
})
export class CollectionComponent extends HTMLElement {
    private readonly element: ShadowRoot;

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
                <disney-carousel>
                    <div id="collection-carousel" slot="carousel-items"></div>
                </disney-carousel>
            </div>
        `;
    }

    private getCarousel(): HTMLElement {
        return this.element.getElementById('collection-carousel') as HTMLElement;
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
            ...content.map<HTMLElement>(({ title, image }: Readonly<Content>, contentIndex: number): HTMLElement => {
                const contentTile: HTMLElement = elementFactory({
                    attributes: [
                        `content-title: ${title}`,
                        `content-index: ${contentIndex + 1}`,
                        `collection-index: ${collectionIndex + 1}`,
                    ],
                    tagName: 'disney-content-tile',
                });
                // @TODO: The elementFactory() function cannot handle URLs (https://)
                //        at this time, because of the colon parsing.
                contentTile.setAttribute('content-image-src', image);
                return contentTile;
            }),
        );
    }
}
