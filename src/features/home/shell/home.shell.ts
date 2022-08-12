import type { CustomElement, RootHTML } from '@common/types';
import { Component, getRootHTML } from '@disney/common';
import type { Collection } from '../types';

@Component({
    selector: 'disney-home',
})
export default class DisneyHomeShell extends HTMLElement implements CustomElement {
    constructor() {
        super();
    }
    rootHtml: RootHTML = getRootHTML.bind(this)();

    private _containers: ReadonlyArray<Collection> = [];
    get containers(): ReadonlyArray<Collection> {
        return this._containers;
    }
    set containers(containers: ReadonlyArray<Collection>) {
        this._containers = containers;
    }

    connectedCallback(): void {
        this.fetchMovies();
        this.render();
    }

    render(): void {
        this.rootHtml.innerHTML = `
            <pre style="color: white">
                ${this.containers.length}
            </pre>
        `;
    }

    private async fetchMovies(): Promise<void> {
        // const response: DisneyAPIResponse | null = await this.api.get(HOME_API);
        // this.containers = this.api.pluckCollections(response);
        console.log(this.containers.length);
        this.render();
    }
}
