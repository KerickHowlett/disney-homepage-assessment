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
const observerOptions: IntersectionObserverInit = {
    root: document.getElementById('disney-collections-list'),
    // rootMargin: '0px',
    threshold: 0,
};

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

    appendCollectionsToDOM(collectionIds: CollectionId[]): void {
        const collectionsList: HTMLElement = this.element.getElementById('home-collections') as HTMLElement;
        const carousel: HTMLElement = this.element.querySelector(`disney-virtual-scroll`) as HTMLElement;
        const preRenderedCollections: NodeListOf<Element> | undefined = carousel?.querySelectorAll(DISNEY_COLLECTION);
        let index: number = preRenderedCollections?.length || 0;
        for (const collectionId of collectionIds) {
            const collectionElement: CollectionComponent = this.createCollectionElement(collectionId, index);
            collectionsList.appendChild(collectionElement);
            index++;
        }
    }

    connectedCallback(): void {
        this.renderTemplate();
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

    private createCollectionElement(collectionId: CollectionId, index: number): CollectionComponent {
        return elementFactory({
            attributes: [`${COLLECTION_ID}: ${collectionId}`, `collection-index: ${index}`],
            tagName: DISNEY_COLLECTION,
        });
    }

    private renderTemplate(): void {
        this.element.innerHTML = `
            <style>${css}</style>
            <disney-virtual-scroll scroll-event-id="HOME-SCROLL">
                <div id="home-collections" class="home-collections"></div>
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
        observerOptions,
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
