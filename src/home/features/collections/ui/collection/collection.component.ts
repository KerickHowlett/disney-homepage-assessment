import {
    changeDetectedBetween,
    Component,
    elementFactory,
    isEmpty,
    isNull,
    isUndefined,
    toNumber,
} from '@disney/shared';

import type { Collection, CollectionId, ContentStateKey } from '@disney/home/data-access';
import { HomeStore } from '@disney/home/data-access';

import css from './collection.component.css?inline';

import '@disney/shared/ui/carousel';
import '../../../content-tile';

const FALLBACK_COLLECTION: Pick<Collection, 'title' | 'content'> = {
    title: '',
    content: [],
};

@Component({
    selector: 'disney-collection',
})
export class CollectionComponent extends HTMLElement {
    private readonly element: ShadowRoot;

    constructor(private readonly store: HomeStore = new HomeStore()) {
        super();
        this.element = this.attachShadow({ mode: 'open' });
    }

    private _collectionId: CollectionId | null = null;
    private _collectionIndex?: number;

    static get observedAttributes(): string[] {
        return ['collection-id', 'collection-index'];
    }

    get carousel(): HTMLElement {
        return this.element.querySelector<HTMLElement>('.collection-carousel')!;
    }

    get collection(): Readonly<Collection> | undefined {
        return this.store.getCollection(this.collectionId!);
    }

    get collectionId(): CollectionId | null {
        return this._collectionId;
    }
    set collectionId(id: CollectionId | null) {
        if (isNull(id)) {
            this.hideCollectionOnError('Collection ID is required');
        }
        this._collectionId = id;
    }

    get collectionIndex(): number {
        return this._collectionIndex ?? -1;
    }
    set collectionIndex(index: number) {
        this._collectionIndex = index;
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (!changeDetectedBetween(oldValue, newValue)) return;
        switch (name) {
            case 'collection-id':
                this.collectionId = newValue;
                break;
            case 'collection-index':
                this.collectionIndex = toNumber(newValue);
                break;
        }
    }

    connectedCallback(): void {
        this.render();
    }

    render(): void {
        if (isUndefined(this.collection?.content)) {
            return this.hideCollectionOnError(`Content not found for Collection ID# ${this.collectionId}.`);
        }
        const { title, content } = this.collection || FALLBACK_COLLECTION;
        this.createTemplate(title);
        this.renderContentTiles(content as ContentStateKey[]);
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
            ...contentIds.map<HTMLElement>(
                (contentId: ContentStateKey, contentIndex: number): HTMLElement =>
                    elementFactory({
                        attributes: {
                            'collection-index': `${this.collectionIndex + 1}`,
                            'content-id': contentId,
                            'content-index': `${contentIndex + 1}`,
                        },
                        tagName: 'disney-content-tile',
                    }),
            ),
        );
    }
}
