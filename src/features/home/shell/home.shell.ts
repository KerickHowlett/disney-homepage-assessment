import type { CustomElement, RootHTML } from '@common/types';
import { Component, getRootHTML } from '@disney/common';
import { HomeStore } from '../store';
import type { CollectionStateKey } from '../types';

@Component({
    selector: 'disney-home',
})
export default class DisneyHomeShell extends HTMLElement implements CustomElement {
    constructor(private readonly store: HomeStore = new HomeStore()) {
        super();
        this.store.subscribe((): void => this.onStateChange());
        // this.store.subscribe(this.onStateChange.bind(this));
    }
    rootHtml: RootHTML = getRootHTML.bind(this)();

    private collectionIds: ReadonlyArray<CollectionStateKey> = [];

    connectedCallback(): void {
        this.store.onInit();
    }

    render(): void {
        this.rootHtml.innerHTML = `
            <pre style="color: white">
                ${this.collectionIds.length}
            </pre>
        `;
    }

    private onStateChange(): void {
        this.collectionIds = this.store.getCollectionIds();
        this.render();
    }
}
