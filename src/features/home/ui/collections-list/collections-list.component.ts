import { Component } from '@common/decorators';
import { getContrastBetween, isEmpty, isNull } from '@common/utils';
import { COLLECTION_ID, DISNEY_COLLECTION } from '../../constants';
import { HomeStore } from '../../store';
import type { Collection, CollectionId } from '../../types';
import type { CollectionComponent } from '../collection';

import '../collection';
import css from './collections-list.component.css?inline';

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

    constructor(
        private readonly store: HomeStore = new HomeStore(),
        private readonly lazyLoadPersonalizationCollection: Generator<void, void, void>,
    ) {
        super();
        this.element = this.attachShadow({ mode: 'open' });
        this.store.subscribe(this.render.bind(this));
        this.lazyLoadPersonalizationCollection ||= this.store.lazyLoadPersonalCollection();
    }

    private readonly renderedCollectionIds: CollectionId[] = [];

    disconnectedCallback(): void {
        this.store.unsubscribe(this.render.bind(this));
    }

    appendCollectionsToDOM(collectionIds: CollectionId[]): void {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const wrapperElement: HTMLElement = this.element.getElementById('home-collections')!;
        for (const collectionId of collectionIds) {
            const collectionComponent: CollectionComponent = this.createCollectionElement(collectionId);
            wrapperElement.appendChild(collectionComponent);
        }
    }

    connectedCallback(): void {
        this.element.innerHTML = `
            <style>${css}</style>
            <div id="home-collections" class="home-collections"></div>
        `;
    }

    render(): void {
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
        const collectionElement: Element | null = this.element.querySelector(`${DISNEY_COLLECTION}:last-child`);
        if (isNull(collectionElement)) return;
        io.observe(collectionElement);
    }

    private pluckIdsFrom(collections: Collection[]): CollectionId[] {
        return collections.map(({ id }: Collection): CollectionId => id);
    }
}
