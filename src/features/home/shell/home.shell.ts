import { Component } from '@disney/common';
import { HomeApi } from '../api';
import { HOME_API } from '../constants';
import type { DisneyHomeResponse, HomepageCollection } from '../types';

@Component({
    selector: 'disney-home',
})
export default class DisneyHomeShell extends HTMLElement {
    constructor(private readonly api: HomeApi = new HomeApi()) {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot!.innerHTML = '';
    }

    private _containers: ReadonlyArray<HomepageCollection> = [];
    get containers(): ReadonlyArray<HomepageCollection> {
        return this._containers;
    }
    set containers(containers: ReadonlyArray<HomepageCollection>) {
        this._containers = containers;
    }

    connectedCallback(): void {
        this.fetchMovies();
    }

    render(): void {
        this.shadowRoot!.innerHTML = `
            <pre style="color: white">
                ${JSON.stringify(this.containers)}
            </pre>
        `;
    }

    private async fetchMovies(): Promise<void> {
        const response: DisneyHomeResponse | null = await this.api.get(HOME_API);
        this.containers = this.api.pluckCollections(response);
        this.render();
    }
}
