import type { CustomElement, RootHTML } from '@common/types';
import { getRootHTML } from '@common/utils/get-root-html';
import { Component } from '@disney/common';
import '@disney/features/home';
import view from './disney.app.html?raw';

@Component({
    selector: 'disney-app',
})
export default class DisneyApp extends HTMLElement implements CustomElement {
    constructor() {
        super();
    }

    rootHtml: RootHTML = getRootHTML.bind(this)();

    connectedCallback(): void {
        this.render();
    }

    render(): void {
        this.rootHtml.innerHTML = view;
    }
}
