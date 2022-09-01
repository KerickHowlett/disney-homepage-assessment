import { Component } from '@disney/common';
import { HomeControls, HomeStore } from '../state-management';

import css from './home.shell.css';

import '../ui/collections-list';
import '../ui/marquee';

@Component({
    selector: 'disney-home',
})
export default class HomeShell extends HTMLElement {
    private readonly element: ShadowRoot;

    constructor(
        private readonly store: HomeStore = new HomeStore(),
        private readonly navigation: HomeControls = new HomeControls(),
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
