import { Component } from '@common/decorators';
import type { ValueOf } from '@common/types';
import '@common/ui/image';
import { changeDetectedBetween } from '@common/utils';
import type { Content, ContentProperties } from '../../types';

@Component({
    selector: 'disney-content-tile',
})
export class ContentTileComponent extends HTMLElement {
    constructor() {
        super();
    }

    private content: Partial<Content> = {
        title: '',
        image: '',
    };

    private currentTemplate = '';

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
        const template: string = this.createTemplate();
        if (changeDetectedBetween(this.currentTemplate, template)) {
            this.innerHTML = template;
        }
    }

    private createTemplate(): string {
        const { image: imageUrl, title } = this.content;
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
                                src="${imageUrl}"
                            />
                        </div>
                    </a>
                </div>
            </div>
        `;
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
}
