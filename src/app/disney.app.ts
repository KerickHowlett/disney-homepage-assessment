import '@disney/features/home';
import { Component } from '../common';
import html from './disney.app.html?raw';

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

    private render(): void {
        const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'open' });
        const template: HTMLTemplateElement = this.createTemplate();
        shadowRoot.appendChild(template.content.cloneNode(true));
    }

    private createTemplate(): HTMLTemplateElement {
        const template: HTMLTemplateElement = document.createElement('template');
        template.id = 'disney-content';
        template.innerHTML = html;
        return template;
    }
}
