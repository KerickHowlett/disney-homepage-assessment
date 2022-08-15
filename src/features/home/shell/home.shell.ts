import { Component } from '@disney/common';
import { HomeStore } from '../store';
import type { CollectionStateKey } from '../types';

@Component({
    selector: 'disney-home',
})
export default class DisneyHomeShell extends HTMLElement {
    constructor(private readonly store: HomeStore = new HomeStore()) {
        super();
        this.store.effect$(this.render);
    }
    private collectionIds: ReadonlyArray<CollectionStateKey> = [];

    connectedCallback(): void {
        this.store.init();
    }

    readonly render = (): void => {
        this.collectionIds = this.store.getCollectionIds();
        this.innerHTML = `
            <pre style="color: white">
                ${this.collectionIds.length}
            </pre>
        `;
    };
}
