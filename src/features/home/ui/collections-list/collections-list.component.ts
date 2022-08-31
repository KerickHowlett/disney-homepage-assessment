import { Component } from '@common/decorators';
import { getContrastBetween, isEmpty, isNull, isUndefined } from '@common/utils';
import { HomeStore } from '../../state-management/store';
import type { Collection, CollectionId } from '../../types';
import type { CollectionComponent } from '../collection';

import css from './collections-list.component.css?inline';

import { elementFactory } from '@common/factories';
import '@common/ui/virtual-scroll';
import { VirtualScroll } from '@common/ui/virtual-scroll';
import '../collection';

const COLLECTION_ID = 'collection-id';
const DISNEY_COLLECTION = 'disney-collection';

@Component({
    selector: 'disney-collections-list',
})
export default class CollectionsListComponent extends HTMLElement {
    private readonly listObserver: MutationObserver = new MutationObserver(this.updateCollectionsList.bind(this));
    private readonly element: ShadowRoot;
    private readonly renderedCollectionIds: CollectionId[] = [];

    private lazyLoadObserver?: IntersectionObserver;

    constructor(private readonly store: HomeStore = new HomeStore()) {
        super();
        this.element = this.attachShadow({ mode: 'open' });
        this.store.subscribe(this.renderCollections.bind(this));
    }

    get collectionsList(): HTMLElement {
        return this.element.querySelector<HTMLElement>('.collections-list')!;
    }

    get slotElement(): HTMLSlotElement {
        return this.collectionsList.querySelector<HTMLSlotElement>('slot')!;
    }

    get lastCollection(): HTMLElement {
        return this.element.querySelector(`disney-collection:last-child`)!;
    }

    get preRenderedCollections(): CollectionComponent[] {
        return Array.from(this.element.querySelectorAll<CollectionComponent>(DISNEY_COLLECTION));
    }

    get virtualScroll(): VirtualScroll {
        return this.element.querySelector<VirtualScroll>('disney-virtual-scroll')!;
    }

    connectedCallback(): void {
        this.render();
        this.bindLazyLoaderObserver();
        this.listObserver.observe(this.collectionsList, { childList: true });
    }

    disconnectedCallback(): void {
        this.listObserver.disconnect();
        this.lazyLoadObserver?.disconnect();
        this.store.unsubscribe(this.renderCollections.bind(this));
    }

    render(): void {
        this.renderTemplate();
        this.renderCollections();
    }

    private updateCollectionsList(): void {
        this.bindLazyLoaderObserver();
        this.lazyLoadObserver?.observe(this.lastCollection);
    }

    private appendCollectionsToDOM(collectionIds: CollectionId[]): void {
        let index: number = this.preRenderedCollections.length;
        for (const collectionId of collectionIds) {
            const collectionElement: CollectionComponent = elementFactory({
                attributes: [`${COLLECTION_ID}: ${collectionId}`, `collection-index: ${index}`],
                tagName: DISNEY_COLLECTION,
            });
            this.collectionsList.appendChild(collectionElement);
            index++;
        }
        this.lazyLoadObserver?.observe(this.lastCollection);
    }

    private bindLazyLoaderObserver(): void {
        if (isNull(this.lastCollection)) return;
        this.lazyLoadObserver = new IntersectionObserver(this.fetchContentForPersonalizedCollection.bind(this), {
            root: this.virtualScroll.viewport,
            threshold: 0.1,
        });
        this.lazyLoadObserver.observe(this.lastCollection);
    }

    private fetchUnrenderedCollections(): CollectionId[] {
        const fetchedCollectionIds: CollectionId[] = this.pluckIdsFrom(this.store.collectionsWithContent);
        const collectionIdsToBeRendered: CollectionId[] = getContrastBetween(
            fetchedCollectionIds,
            this.renderedCollectionIds,
        );
        this.renderedCollectionIds.push(...collectionIdsToBeRendered);
        return collectionIdsToBeRendered;
    }

    private fetchContentForPersonalizedCollection(
        entries: ReadonlyArray<IntersectionObserverEntry>,
        observer: IntersectionObserver,
    ): void {
        const lastCollection: IntersectionObserverEntry = entries[0];
        if (!lastCollection.isIntersecting) return;
        observer.unobserve(lastCollection.target);

        const nextRefId: CollectionId = this.pluckIdsFrom(this.store.collectionsWithNoContent)[0];
        if (isUndefined(nextRefId)) return observer.disconnect();
        this.store.loadPersonalizedContent(nextRefId);
    }

    private pluckIdsFrom(collections: Collection[]): CollectionId[] {
        return collections.map(({ id }: Collection): CollectionId => id);
    }

    private renderCollections(): void {
        const unrenderedCollections: CollectionId[] = this.fetchUnrenderedCollections();
        if (isEmpty(unrenderedCollections)) return;
        this.appendCollectionsToDOM(unrenderedCollections);
    }

    private renderTemplate(): void {
        this.element.innerHTML = `
            <style>${css}</style>
            <div class="collections-list-container">
                <disney-virtual-scroll>
                    <div class="collections-list" slot="content"></div>
                </disney-virtual-scroll>
            </div>
        `;
    }
}
