/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component } from '@common/decorators';
import { elementFactory } from '@common/factories';
import '@common/ui/image';
import type { ImageComponent } from '@common/ui/image';
import { changeDetectedBetween, isEmpty } from '@common/utils';
import { HomeControls } from '../../state-management/controls';
import type { Content } from '../../types';

import css from './content-tile.component.css';

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

    private content: Content = {} as Content;

    attributeChangedCallback(_: string, oldValue: string, newValue: string): void {
        if (!changeDetectedBetween(oldValue, newValue)) return;
        this.navigationHandler();
    }

    connectedCallback(): void {
        this.getContentTileAttributes();
        this.render();
    }

    render(): void {
        this.renderContentTile();
        this.setImgOnErrorListener();
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
                                tabindex="0"
                                loading="lazy"
                                src="${image}"
                            />
                        </div>
                    </a>
                </div>
            </div>
        `;
    }

    private renderTitleOverlay(image: ImageComponent): void {
        const titleElement: HTMLDivElement = elementFactory<HTMLDivElement>({
            classes: ['image-failsafe-title'],
            body: this.content.title,
        });
        image.insertAdjacentElement('afterend', titleElement);
    }

    private getContentTileAttributes(): void {
        this.content = {
            title: this.getAttribute('content-title') ?? '',
            image: this.getAttribute('content-image-src') ?? '',
            id: this.getAttribute('content-id') ?? '',
        };
    }

    private setImgOnErrorListener(): void {
        const image: ImageComponent = this.element.querySelector('img') as ImageComponent;
        image.onerror = (): void => {
            image.renderFailsafeImage();
            image.classList.add('image-failsafe');
            this.renderTitleOverlay(image);
        };
    }

    private navigationHandler(): void {
        if (!this.isActiveContentTile()) return;
        const tileLink: HTMLAnchorElement = this.element.querySelector<HTMLAnchorElement>('.content-tile-link')!;
        const image: HTMLImageElement = tileLink.querySelector<HTMLImageElement>('.content-image-tile')!;
        image.focus();
    }

    private isActiveContentTile(): boolean {
        const collectionIndex: number = this.getAttributeIndex('collection-index');
        const interactiveIndex: number = this.getAttributeIndex('interactive-tile');
        const { column: focusedTile, row: focusedCollection } = this.controls.state;
        return focusedCollection === collectionIndex && focusedTile === interactiveIndex;
    }

    private getAttributeIndex(attributeName: string): number {
        const attributeValue: string = this.getAttribute(attributeName) || '';
        if (isEmpty(attributeValue)) return -1;
        const index: number = parseInt(attributeValue);
        return isNaN(index) ? -1 : index;
    }
}
