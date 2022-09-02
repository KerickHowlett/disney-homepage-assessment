import { Component } from '@disney/shared';
import { HomeStore, NavigationFacade } from '../data-access';

import css from './home.shell.css';

import '../features/collections';
import '../features/marquee';

@Component({
    selector: 'disney-home',
})
export default class HomeShell extends HTMLElement {
    private readonly element: ShadowRoot;

    constructor(
        private readonly store: HomeStore = new HomeStore(),
        private readonly navigation: NavigationFacade = new NavigationFacade(),
    ) {
        super();
        this.element = this.attachShadow({ mode: 'open' });
    }

    connectedCallback(): void {
        this.store.loadStandardCollections();
        this.render();
        this.navigation.init();
    }

    render(): void {
        this.element.innerHTML = `
            <style>${css}</style>
            <disney-marquee></disney-marquee>
            <disney-collections-list></disney-collections-list>
        `;
    }
}
