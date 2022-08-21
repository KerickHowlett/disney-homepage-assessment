import { elementFactory } from '@common/factories';
import { Component, isNull, isUndefined } from '@disney/common';
import { COLLECTION_ID } from '../../constants';
import { HomeStore } from '../../store';
import type { Collection, CollectionId, Content } from '../../types';

import '@common/ui/carousel';
import '../content-tile';
import css from './collection.component.css?inline';

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
        const collectionId: CollectionId | null = this.getAttribute(COLLECTION_ID);
        if (isNull(collectionId)) {
            console.error('Collection ID is required');
            return;
        }
        this.collectionId = collectionId;
        this.render();
    }

    render(): void {
        if (isUndefined(this.collectionId)) {
            this.hideCollection();
            return;
        }
        this.collection = this.store.getCollection(this.collectionId);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.createTemplate(this.collection!);
    }

    private createContentTile({ image, title }: Readonly<Content>): HTMLElement {
        const contentTile: HTMLElement = elementFactory({
            tagName: 'disney-content-tile',
            attributes: [`content-title: ${title}`],
        });
        contentTile.setAttribute('content-image-src', image);
        return contentTile;
    }

    private createContentTiles(content: ReadonlyArray<Content>): void {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const carousel: HTMLElement = this.element.querySelector('disney-carousel')!;
        carousel.replaceChildren(...content.map<HTMLElement>(this.createContentTile.bind(this)));
    }

    private createTemplate({ content, title }: Readonly<Collection>): void {
        if (isUndefined(content)) return;
        this.element.innerHTML = `
            <style>${css}</style>
            <h4 class="text-color--primary">${title}</h4>
            <div class="collection-content">
                <disney-carousel></disney-carousel>
            </div>
        `;
        this.createContentTiles(content);
    }

    private hideCollection(): void {
        this.style.display = 'none';
        this.innerHTML = '';
    }
}
