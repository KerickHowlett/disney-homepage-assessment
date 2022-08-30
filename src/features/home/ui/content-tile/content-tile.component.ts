/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component } from '@common/decorators/component';
import { elementFactory } from '@common/factories/element';
import type { ImageComponent } from '@common/ui/image';
import { changeDetectedBetween, isUndefined, toNumber } from '@common/utils';
import { HomeControls, HomeStore } from '../../state-management';
import type { Content } from '../../types';

import css from './content-tile.component.css';

import '@common/ui/image';

@Component({
    selector: 'disney-content-tile',
})
export class ContentTileComponent extends HTMLElement {
    private readonly element: ShadowRoot;

    constructor(
        private readonly controls: HomeControls = new HomeControls(),
        private readonly store: HomeStore = new HomeStore(),
    ) {
        super();
        this.element = this.attachShadow({ mode: 'open', delegatesFocus: true });
        this.controls.subscribe(this.navigationHandler.bind(this));
        this.store.subscribe(this.render.bind(this));
    }

    get collectionIndex(): number {
        const indexAttribute: string | null = this.getAttribute('collection-index');
        return toNumber(indexAttribute);
    }

    get content(): Readonly<Content> {
        return this.store.getContent(this.contentId!)!;
    }

    get contentId(): string | null {
        return this.getAttribute('content-id');
    }

    get contentIndex(): number {
        const indexAttribute: string | null = this.getAttribute('content-index');
        return toNumber(indexAttribute);
    }

    get contentTileWrapper(): HTMLElement {
        return this.element.querySelector('.content-tile')!;
    }

    get imageElement(): ImageComponent {
        return this.element.querySelector<ImageComponent>('img')!;
    }

    get tileLink(): HTMLAnchorElement {
        return this.element.querySelector<HTMLAnchorElement>('.content-tile-link')!;
    }

    connectedCallback(): void {
        this.render();
    }

    disconnectedCallback(): void {
        this.controls.unsubscribe(this.navigationHandler);
    }

    render(): void {
        if (isUndefined(this.content)) return;
        this.renderContentTile();
        this.setImgOnErrorListener();
        this.navigationHandler();
    }

    private isFocusedContentTile(): boolean {
        const { column: focusedTile, row: focusedCollection } = this.controls.state;
        return focusedCollection === this.collectionIndex && focusedTile === this.contentIndex;
    }

    private navigationHandler(): void {
        if (!this.isFocusedContentTile()) return;
        this.imageElement.focus();
    }

    private renderContentTile(): void {
        const { image, title } = this.content;
        const html = `
            <style>${css}</style>
            <div class="content-tile">
                <div class="content-tile-container" aria-hidden="false">
                    <a class="content-tile-link">
                        <div class="image-container">
                            <img
                                alt="${title}"
                                aria-label="${title}"
                                class="content-image-tile"
                                failsafe-src="/default-content-tile.jpeg"
                                is="disney-image"
                                loading="lazy"
                                src="${image}"
                                tabindex="0"
                            />
                        </div>
                    </a>
                </div>
            </div>
        `;
        if (!changeDetectedBetween(this.element.innerHTML, html)) return;
        this.element.innerHTML = html;
    }

    private renderTitleOverlay(): void {
        const titleElement: HTMLDivElement = elementFactory<HTMLDivElement>({
            classes: ['image-failsafe-title'],
            body: this.content?.title,
        });
        this.imageElement.insertAdjacentElement('afterend', titleElement);
    }

    private setImgOnErrorListener(): void {
        this.imageElement.onerror = (): void => {
            this.imageElement.renderFailsafeImage();
            this.imageElement.classList.add('image-failsafe');
            this.renderTitleOverlay();
        };
    }
}
