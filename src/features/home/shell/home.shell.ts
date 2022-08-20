import { Component, getContrastBetween, isEmpty, isNull } from '@disney/common';
import { HomeStore } from '../store';
import type { Collection, CollectionId } from '../types';
import type { CollectionComponent } from '../ui/collection';

import { COLLECTION_ID, DISNEY_COLLECTION } from '../constants';
import '../ui/collection';

const observerOptions: IntersectionObserverInit = {
    root: document.getElementById('disney-home'),
    rootMargin: '0px',
    threshold: 0, // 50% of the element is visible.
};

@Component({
    selector: 'disney-home',
})
export default class DisneyHomeShell extends HTMLElement {
    constructor(
        private readonly store: HomeStore = new HomeStore(),
        private readonly lazyLoadPersonalizationCollection: Generator<
            void,
            void,
            void
        > = store.lazyLoadPersonalCollection(),
    ) {
        super();
        this.store.subscribe(this.render.bind(this));
    }

    private readonly renderedCollectionIds: CollectionId[] = [];

    connectedCallback(): void {
        this.store.loadStandardCollections();
    }

    disconnectedCallback(): void {
        this.store.unsubscribe(this.render.bind(this));
    }

    appendCollectionsToDOM(collectionIds: CollectionId[]): void {
        for (const collectionId of collectionIds) {
            const collectionComponent: CollectionComponent = this.createCollectionElement(collectionId);
            this.appendChild(collectionComponent);
        }
    }

    render(): void {
        console.count('render');
        const unrenderedCollections: CollectionId[] = this.fetchUnrenderedCollections();
        if (!this.changeDetected(unrenderedCollections)) return;
        this.appendCollectionsToDOM(unrenderedCollections);
        this.setupPersonalizedCollectionsLazyLoad();
    }

    private changeDetected(unrenderedCollections: CollectionId[]): boolean {
        return !isEmpty(unrenderedCollections);
    }

    private createCollectionElement(collectionId: CollectionId): CollectionComponent {
        const collectionComponent: CollectionComponent = document.createElement(
            DISNEY_COLLECTION,
        ) as CollectionComponent;
        collectionComponent.setAttribute(COLLECTION_ID, collectionId);
        return collectionComponent;
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

    private setupPersonalizedCollectionsLazyLoad(): void {
        const lastCollectionObserver: IntersectionObserver = new IntersectionObserver(
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

        this.observeLastCollectionElement(lastCollectionObserver);
    }

    private observeLastCollectionElement(io: IntersectionObserver): void {
        const collectionElement: Element | null = this.querySelector(`${DISNEY_COLLECTION}:last-child`);
        if (isNull(collectionElement)) return;
        io.observe(collectionElement);
    }

    private pluckIdsFrom(collections: Collection[]): CollectionId[] {
        return collections.map(({ id }: Collection): CollectionId => id);
    }
}
