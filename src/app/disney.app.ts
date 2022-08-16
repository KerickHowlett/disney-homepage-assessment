import { Component } from '@disney/common';
import '@disney/features/home';
import view from './disney.app.html?raw';

@Component({
    selector: 'disney-app',
})
export default class DisneyApp extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback(): void {
        this.render();
    }

    render(): void {
        this.innerHTML = view;
    }
}
