/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component } from '@common/decorators/component';
import { elementFactory } from '@common/factories/element';
import type { ImageComponent } from '@common/ui/image';
import { changeDetectedBetween, toNumber } from '@common/utils';
import { HomeControls } from '../../state-management';
import type { Content } from '../../types';
import { INTERACTIVE_TILE } from '../collection';

import css from './content-tile.component.css';

import '@common/ui/image';

@Component({
    selector: 'disney-content-tile',
})
export class ContentTileComponent extends HTMLElement {
    private readonly element: ShadowRoot;

    constructor(private readonly controls: HomeControls = new HomeControls()) {
        super();
        this.element = this.attachShadow({ mode: 'open', delegatesFocus: true });
        this.controls.subscribe(this.navigationHandler.bind(this));
    }

    static get observedAttributes(): string[] {
        return ['interactive-tile'];
    }

    get collectionIndex(): number {
        const indexAttribute: string | null = this.getAttribute('collection-index');
        return toNumber(indexAttribute);
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

    get interactiveIndex(): number {
        const indexAttribute: string | null = this.contentTileWrapper.getAttribute(INTERACTIVE_TILE);
        return toNumber(indexAttribute);
    }

    get tileLink(): HTMLAnchorElement {
        return this.element.querySelector<HTMLAnchorElement>('.content-tile-link')!;
    }

    private content: Content = {} as Content;

    attributeChangedCallback(_: string, oldValue: string, newValue: string): void {
        if (!changeDetectedBetween(oldValue, newValue)) return;
        this.navigationHandler();
    }

    connectedCallback(): void {
        this.getContentTileAttributes();
        this.render();
    }

    disconnectedCallback(): void {
        this.controls.unsubscribe(this.navigationHandler);
    }

    render(): void {
        this.renderContentTile();
        this.setImgOnErrorListener();
        this.navigationHandler();
        this.focusOnInit();
    }

    private renderContentTile(): void {
        const { image, title } = this.content;
        this.element.innerHTML = `
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
    }

    private renderTitleOverlay(): void {
        const titleElement: HTMLDivElement = elementFactory<HTMLDivElement>({
            classes: ['image-failsafe-title'],
            body: this.content.title,
        });
        this.imageElement.insertAdjacentElement('afterend', titleElement);
    }

    // @NOTE: This is a small hack to focus on the first tile on the homepage's
    //        top-left-hand corner when the page is first loaded.
    //        This was necessary because the interactive index that is used to
    //        target these tiles starts off as -1 since the carousel component
    //        hasn't added the necessary attributes to the tiles yet.
    private focusOnInit(): void {
        const firstContentTileRenderedInView = this.contentIndex === 1 && this.collectionIndex === 1;
        if (!firstContentTileRenderedInView) return;
        this.imageElement.focus();
    }

    private getContentTileAttributes(): void {
        this.content = {
            title: this.getAttribute('content-title')!,
            image: this.getAttribute('content-image-src')!,
            id: this.getAttribute('content-id')!,
        };
    }

    private isActiveContentTile(): boolean {
        const { column: focusedTile, row: focusedCollection } = this.controls.state;
        return focusedCollection === this.collectionIndex && focusedTile === this.contentIndex;
    }

    private navigationHandler(): void {
        if (!this.isActiveContentTile()) return;
        this.imageElement.focus();
    }

    private setImgOnErrorListener(): void {
        this.imageElement.onerror = (): void => {
            this.imageElement.renderFailsafeImage();
            this.imageElement.classList.add('image-failsafe');
            this.renderTitleOverlay();
        };
    }
}
