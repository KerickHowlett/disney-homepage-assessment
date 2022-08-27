import { Component } from '@common/decorators';
import { getContrastBetween, isEmpty, isNull } from '@common/utils';
import { HomeStore } from '../../state-management/store';
import type { Collection, CollectionId } from '../../types';
import type { CollectionComponent } from '../collection';

import css from './collections-list.component.css?inline';

import { elementFactory } from '@common/factories';
import '@common/ui/virtual-scroll';
import '../collection';

const COLLECTION_ID = 'collection-id';
const DISNEY_COLLECTION = 'disney-collection';

@Component({
    selector: 'disney-collections-list',
})
export default class CollectionsListComponent extends HTMLElement {
    private readonly element: ShadowRoot;
    private readonly renderedCollectionIds: CollectionId[] = [];

    constructor(
        private readonly store: HomeStore = new HomeStore(),
        private readonly lazyLoadPersonalizationCollection: Generator<void, void, void>,
    ) {
        super();
        this.element = this.attachShadow({ mode: 'open' });
        this.store.subscribe(this.render.bind(this));
        this.lazyLoadPersonalizationCollection ||= this.store.lazyLoadPersonalCollection();
    }

    get collectionsList(): HTMLElement {
        return this.element.querySelector<HTMLElement>('.home-collections-list')!;
    }

    get preRenderedCollections(): HTMLElement[] {
        return Array.from(this.element.querySelectorAll<HTMLElement>(DISNEY_COLLECTION));
    }

    connectedCallback(): void {
        this.renderTemplate();
        this.render();
    }

    disconnectedCallback(): void {
        this.store.unsubscribe(this.render.bind(this));
    }

    render(): void {
        const unrenderedCollections: CollectionId[] = this.fetchUnrenderedCollections();
        if (isEmpty(unrenderedCollections)) return;
        this.appendCollectionsToDOM(unrenderedCollections);
        this.observeLastCollectionElement(this.lastCollectionObserver);
    }

    private appendCollectionsToDOM(collectionIds: CollectionId[]): void {
        let index: number = this.preRenderedCollections.length;
        for (const collectionId of collectionIds) {
            const collectionElement: CollectionComponent = this.createCollectionElement(collectionId, index);
            this.collectionsList.appendChild(collectionElement);
            index++;
        }
    }

    private createCollectionElement(collectionId: CollectionId, index: number): CollectionComponent {
        return elementFactory({
            attributes: [`${COLLECTION_ID}: ${collectionId}`, `collection-index: ${index}`],
            tagName: DISNEY_COLLECTION,
        });
    }

    private renderTemplate(): void {
        this.element.innerHTML = `
            <style>${css}</style>
            <disney-virtual-scroll>
                <div class="home-collections-list" slot="content"></div>
            </disney-virtual-scroll>
        `;
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

    private readonly lastCollectionObserver: IntersectionObserver = new IntersectionObserver(
        (entries: IntersectionObserverEntry[], observer: IntersectionObserver): void => {
            const lastCollection: IntersectionObserverEntry = entries[0];
            if (!lastCollection.isIntersecting) return;

            observer.unobserve(this);
            const { done: allCollectionsAreLoaded } = this.lazyLoadPersonalizationCollection.next();
            if (allCollectionsAreLoaded) return observer.disconnect();

            this.observeLastCollectionElement(observer);
        },
        { threshold: 0, root: this },
    );

    private observeLastCollectionElement(io: IntersectionObserver): void {
        const collectionElement: Element | null = this.element.querySelector(`${DISNEY_COLLECTION}:last-child`);
        if (isNull(collectionElement)) return;
        io.observe(collectionElement);
    }

    private pluckIdsFrom(collections: Collection[]): CollectionId[] {
        return collections.map(({ id }: Collection): CollectionId => id);
    }
}
