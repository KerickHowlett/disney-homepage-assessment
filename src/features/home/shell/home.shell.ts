import type { CustomElement, RootHTML } from '@common/types';
import { Component, getRootHTML } from '@disney/common';
import { HomeApi } from '../api';
import { HOME_API } from '../constants';
import type { DisneyHomeResponse, HomepageCollection } from '../types';

@Component({
    selector: 'disney-home',
})
export default class DisneyHomeShell extends HTMLElement implements CustomElement {
    constructor(private readonly api: HomeApi = new HomeApi()) {
        super();
    }

    rootHtml: RootHTML = getRootHTML.bind(this)();

    private _containers: ReadonlyArray<HomepageCollection> = [];
    get containers(): ReadonlyArray<HomepageCollection> {
        return this._containers;
    }
    set containers(containers: ReadonlyArray<HomepageCollection>) {
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
        const response: DisneyHomeResponse | null = await this.api.get(HOME_API);
        this.containers = this.api.pluckCollections(response);
        console.log(this.containers.length);
        this.render();
    }
}
