import { Component } from '@disney/common';
import '@disney/features/home';

import css from './disney.app.css?inline';

@Component({
    selector: 'disney-app',
})
export default class DisneyApp extends HTMLElement {
    private readonly element: ShadowRoot;

    constructor() {
        super();
        this.element = this.attachShadow({ mode: 'open' });
    }

    connectedCallback(): void {
        this.render();
    }

    render(): void {
        this.element.innerHTML = `
            <style>${css}</style>
            <div class="app-body">
                <div class="app-background"></div>
                <main class="container">
                    <disney-home></disney-home>
                </main>
            </div>
        `;
    }
}
