import { Component, elementFactory, isEmpty, isNull, isUndefined, toNumber } from '@disney/common';
import { HomeStore } from '../../state-management/store';
import type { Collection, CollectionId, ContentStateKey } from '../../types';

import css from './collection.component.css?inline';

import '@common/ui/carousel';
import '../content-tile';

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

    get carousel(): HTMLElement {
        return this.element.querySelector<HTMLElement>('.collection-carousel')!;
    }

    get collection(): Readonly<Collection> | undefined {
        return this.store.getCollection(this.collectionId!);
    }

    get collectionIndex(): number {
        const indexAttribute: string | null = this.getAttribute('collection-index');
        return toNumber(indexAttribute);
    }

    connectedCallback(): void {
        const collectionId: CollectionId | null = this.getAttribute('collection-id');
        if (isNull(collectionId)) {
            return this.hideCollectionOnError('Collection ID is required');
        }
        this.collectionId = collectionId;
        this.render();
    }

    render(): void {
        if (isUndefined(this.collection?.content)) {
            return this.hideCollectionOnError(`Content not found for Collection ID# ${this.collectionId}.`);
        }
        this.createTemplate(this.collection!.title);
        this.renderContentTiles(this.collection!.content);
    }

    private createTemplate(title: string): void {
        this.element.innerHTML = `
            <style>${css}</style>
            <h4>${title}</h4>
            <div class="collection-content">
                <disney-carousel>
                    <div class="collection-carousel" slot="carousel-items"></div>
                </disney-carousel>
            </div>
        `;
    }

    private hideCollectionOnError(message: string): void {
        if (!isEmpty(message)) console.error(message);
        this.style.display = 'none';
        this.innerHTML = '';
    }

    private renderContentTiles(contentIds: ContentStateKey[]): void {
        this.carousel.replaceChildren(
            ...contentIds.map<HTMLElement>((contentId: ContentStateKey, contentIndex: number): HTMLElement => {
                return elementFactory({
                    attributes: [
                        `content-id: ${contentId}`,
                        `content-index: ${contentIndex + 1}`,
                        `collection-index: ${this.collectionIndex + 1}`,
                    ],
                    tagName: 'disney-content-tile',
                });
            }),
        );
    }
}
