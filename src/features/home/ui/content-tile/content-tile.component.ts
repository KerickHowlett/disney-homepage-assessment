import { Component } from '@common/decorators';
import { elementFactory } from '@common/factories';
import '@common/ui/image';
import type { ImageComponent } from '@common/ui/image';
import type { Content } from '../../types';

import css from './content-tile.component.css';

@Component({
    selector: 'disney-content-tile',
})
export class ContentTileComponent extends HTMLElement {
    private readonly element: ShadowRoot;

    constructor() {
        super();
        this.element = this.attachShadow({ mode: 'open' });
    }

    private content: Content = {} as Content;

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
                    <a class="content-tile-link" tab-index="0">
                        <div class="image-container">
                            <img
                                alt="${title}"
                                aria-label="${title}"
                                class="content-image-tile"
                                failsafe-src="/default-content-tile.jpeg"
                                is="disney-image"
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
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const image: ImageComponent = this.element.querySelector('img')! as ImageComponent;
        image.onerror = (): void => {
            image.renderFailsafeImage();
            image.classList.add('image-failsafe');
            this.renderTitleOverlay(image);
        };
    }
}
