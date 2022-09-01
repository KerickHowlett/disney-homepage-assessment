/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component } from '@common/decorators/component';
import { elementFactory } from '@common/factories/element';
import type { ImageComponent } from '@common/ui/image';
import { changeDetectedBetween, isNull, isUndefined, toNumber } from '@common/utils';
import { HomeStore } from '../../state-management';
import type { Content } from '../../types';

import css from './content-tile.component.css';

import '@common/ui/image';

const NULL_CONTENT: Content = { tileImage: '', title: '' } as Content;

@Component({
    selector: 'disney-content-tile',
})
export class ContentTileComponent extends HTMLElement {
    private readonly element: ShadowRoot;
    private previousContent?: Content;

    constructor(private readonly store: HomeStore = new HomeStore()) {
        super();
        this.store.subscribe(this.updateContentAttributes.bind(this));
        this.element = this.attachShadow({ mode: 'open', delegatesFocus: true });
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
        this.store.unsubscribe(this.updateContentAttributes.bind(this));
    }

    render(): void {
        if (isUndefined(this.content)) return;
        this.renderContentTile();
        this.setImgOnErrorListener();
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
        this.previousContent = this.content;
    }

    private renderTitleOverlay(): void {
        this.imageElement.insertAdjacentElement(
            'afterend',
            elementFactory({
                classes: ['image-failsafe-title'],
                body: this.content?.title,
            }),
        );
    }

    private setImgOnErrorListener(): void {
        this.imageElement.onerror = (): void => {
            this.imageElement.renderFailsafeImage();
            this.imageElement.classList.add('image-failsafe');
            this.renderTitleOverlay();
        };
    }

    private updateContentAttributes(): void {
        const { tileImage: oldTileImage, title: oldTitle } = this.previousContent || NULL_CONTENT;
        const { tileImage: newTileImage, title: newTitle } = this.content || NULL_CONTENT;
        this.updateImageAltAndAriaLabel(oldTitle, newTitle);
        this.updateImage(oldTileImage, newTileImage);
    }

    private updateImageAltAndAriaLabel(oldTitle: string, newTitle: string): void {
        if (!changeDetectedBetween(oldTitle, newTitle)) return;
        this.imageElement.setAttribute('alt', newTitle);
        this.imageElement.setAttribute('aria-label', newTitle);
    }

    private updateImage(oldTileImage: string, newTileImage: string): void {
        if (!changeDetectedBetween(oldTileImage, newTileImage)) return;

        this.imageElement.src = newTileImage;
        const titleElement: HTMLDivElement | null = this.element.querySelector('.image-failsafe-title');

        if (!isNull(titleElement)) {
            this.imageElement.classList.remove('image-failsafe');
            titleElement.remove();
        }

        if (!isNull(this.imageElement.onerror)) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this.imageElement as any).onerror();
    }
}
