import { Component } from '@disney/common';
import { HomeStore } from '../store';

import '../ui/collections-list';

@Component({
    selector: 'disney-home',
})
export default class HomeShell extends HTMLElement {
    private readonly element: ShadowRoot;

    constructor(private readonly store: HomeStore = new HomeStore()) {
        super();
        this.element = this.attachShadow({ mode: 'open' });
    }

    connectedCallback(): void {
        this.store.loadStandardCollections();
        this.render();
    }

    render() {
        const collectionsList: HTMLElement = document.createElement('disney-collections-list');
        this.element.replaceChildren(collectionsList);
    }
}
