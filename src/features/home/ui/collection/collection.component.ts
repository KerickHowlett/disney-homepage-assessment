import type { CustomElement, RootHTML } from '@common/types';
import { Component, getRootHTML } from '@disney/common';

@Component({
    selector: 'disney-collection',
})
export class DisneyCollectionComponent extends HTMLElement implements CustomElement {
    constructor() {
        super();
    }

    rootHtml: RootHTML = getRootHTML.bind(this)();

    connectedCallback(): void {
        this.render();
    }

    render(): void {
        this.rootHtml.innerHTML = '';
    }
}
