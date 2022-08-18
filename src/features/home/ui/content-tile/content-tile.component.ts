import { Component } from '@common/decorators';
import type { ValueOf } from '@common/types';
import '@common/ui/image';
import type { ImageComponent } from '@common/ui/image';
import { changeDetectedBetween, isNil, isNull } from '@common/utils';
import type { Content, ContentProperties } from '../../types';

@Component({
    selector: 'disney-content-tile',
})
export class ContentTileComponent extends HTMLElement {
    private content: Partial<Content> = {
        title: '',
        image: '',
    };

    private currentTemplate = '';

    static get observedAttributes(): string[] {
        return ['title', 'image'];
    }

    connectedCallback(): void {
        this.content = this.getContentTileAttributes('title', 'image');
        this.render();
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (!changeDetectedBetween(oldValue, newValue)) return;
        this.content = { ...this.content, [name]: newValue };
        this.render();
    }

    render(): void {
        const templateInnerHTML: string = this.createTemplateInnerHTML(this.content);
        if (changeDetectedBetween(this.currentTemplate, templateInnerHTML)) {
            this.innerHTML = templateInnerHTML;
            this.setImgOnErrorListener();
        }
    }

    private createTemplateInnerHTML({ title, image }: Partial<Content>): string {
        return `
            <div class="content-tile">
                <div class="content-tile-container" aria-hidden="false">
                    <a class="content-tile-link" tab-index="0">
                        <div class="image-container">
                            <img
                                alt="${title}"
                                aria-label="${title}"
                                class="content-image-tile"
                                failsafe-src="/src/assets/default-content-tile.jpeg"
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

    private createTitleOverlay(image: ImageComponent): void {
        if (isNil(this.content.title)) return;

        const titleElement = document.createElement('div');
        titleElement.classList.add('image-failsafe-title', 'text-color--primary');
        titleElement.textContent = this.content.title;

        image.classList.add('image-failsafe');
        image.insertAdjacentElement('afterend', titleElement);
    }

    private getContentTileAttributes(...names: string[]): Content {
        return names.reduce<Readonly<Record<ContentProperties, string>>>(
            (content: Content, name: string) => ({
                ...content,
                [name as ContentProperties]: this.getAttribute(name) as ValueOf<Content>,
            }),
            {} as Content,
        );
    }

    private setImgOnErrorListener(): void {
        const image: ImageComponent | null = this.querySelector('img') as ImageComponent | null;
        if (isNull(image)) return;
        image.onerror = (): void => {
            image.renderFailsafeImage();
            this.createTitleOverlay(image);
        };
    }
}
