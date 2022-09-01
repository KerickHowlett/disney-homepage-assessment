import { Component } from '@common/decorators/component';
import { changeDetectedBetween, isNull, isUndefined, toNumber } from '@common/utils';
import { HomeStore } from '../../state-management';
import type { Content } from '../../types';
import type { ContentTileImageComponent } from '../content-tile-image';

import css from './content-tile.component.css';

import '../content-tile-image';

const DEFAULT_CONTENT_TILE: Content = { title: '', tileImage: '' } as Content;
const DEFAULT_TILE_IMAGE = '/default-content-tile.jpeg';

@Component({
    selector: 'disney-content-tile',
})
export class ContentTileComponent extends HTMLElement {
    private readonly element: ShadowRoot;
    private previousContent?: Content;
    private _contentId: string | null = null;
    private _contentIndex = 1;

    constructor(private readonly store: HomeStore = new HomeStore()) {
        super();
        this.store.subscribe(this.updateTileImageAttributes.bind(this));
        this.element = this.attachShadow({ mode: 'open', delegatesFocus: true });
    }

    get collectionIndex(): number {
        const indexAttribute: string | null = this.getAttribute('collection-index');
        return toNumber(indexAttribute);
    }

    get content(): Readonly<Content> {
        if (!isNull(this.contentId)) return this.store.getContent(this.contentId)!;
        console.error('Content ID was not set for tile:', this);
        return DEFAULT_CONTENT_TILE;
    }

    set contentId(contentId: string | null) {
        this._contentId = contentId;
    }
    get contentId(): string | null {
        return this._contentId;
    }

    get contentIndex(): number {
        return this._contentIndex;
    }
    set contentIndex(index: number) {
        this._contentIndex = index;
    }

    get imageElement(): ContentTileImageComponent {
        return this.element.querySelector<ContentTileImageComponent>('img')!;
    }

    static get observedAttributes(): string[] {
        return ['content-id', 'content-index'];
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (!changeDetectedBetween(oldValue, newValue)) return;
        switch (name) {
            case 'content-id':
                this.contentId = newValue;
                break;
            case 'content-index':
                this.contentIndex = toNumber(newValue);
                break;
        }
    }

    connectedCallback(): void {
        this.render();
    }

    disconnectedCallback(): void {
        this.store.unsubscribe(this.updateTileImageAttributes.bind(this));
    }

    render(): void {
        if (isUndefined(this.content)) return;
        this.renderContentTile();
    }

    private renderContentTile(): void {
        const { tileImage: image, title } = this.content;
        this.element.innerHTML = `
            <style>${css}</style>
            <div class="content-tile">
                <div class="content-tile-container" aria-hidden="false">
                    <a class="content-tile-link">
                        <div class="image-container">
                            <img
                                class="content-image-tile"
                                content-title="${title}"
                                failsafe-src="${DEFAULT_TILE_IMAGE}"
                                is="disney-content-tile-image"
                                loading="lazy"
                                src="${image}"
                                tabindex="0"
                            />
                        </div>
                    </a>
                </div>
            </div>
        `;
        this.previousContent = this.content;
    }

    private updateTileImageAttributes(): void {
        if (changeDetectedBetween(this.previousContent?.title, this.content?.title)) {
            this.imageElement.setAttribute('content-title', this.content?.title);
        }
        if (changeDetectedBetween(this.previousContent?.tileImage, this.content?.tileImage)) {
            this.imageElement.setAttribute('src', this.content?.tileImage);
        }
    }
}
