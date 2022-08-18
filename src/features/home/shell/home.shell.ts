import { Component } from '@disney/common';
import { HomeStore } from '../store';
import type { CollectionId } from '../types';
import '../ui/collection';

@Component({
    selector: 'disney-home',
})
export default class DisneyHomeShell extends HTMLElement {
    constructor(private readonly store: HomeStore = new HomeStore()) {
        super();
        this.store.effect$(this.render);
    }
    connectedCallback(): void {
        this.store.init();
    }

    readonly render = (): void => {
        this.createCollectionElements();
    };

    private createCollectionElements(): void {
        const collectionIds: ReadonlyArray<CollectionId> = this.store.getCollectionIds();
        collectionIds.forEach((id: CollectionId): void => {
            const collectionElement: HTMLElement = document.createElement('disney-collection');
            collectionElement.setAttribute('collection-id', id as string);
            this.appendChild(collectionElement);
        });
    }
}
