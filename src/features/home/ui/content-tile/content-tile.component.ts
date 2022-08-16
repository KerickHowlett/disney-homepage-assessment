import { Component } from '@common/decorators';
import type { ValueOf } from '@common/types';
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

    attributeChangedCallback(name: string, _oldValue: string, newValue: string): void {
        this.content = {
            ...this.content,
            [name]: newValue,
        };
        this.render();
    }

    render(): void {
        const template: string = this.createTemplate();
        if (this.changeDetected(template)) this.innerHTML = template;
    }

    private changeDetected(newTemplate: string): boolean {
        return this.currentTemplate !== newTemplate;
    }

    private createTemplate(): string {
        const { image: imageUrl, title } = this.content;
        return `
            <div class="content-tile">
                <div class="content-tile-container" aria-hidden="false">
                    <a class="content-tile-link" tab-index="0">
                        <div class="image-container">
                            <img class="content-image-tile" src="${imageUrl}" alt="${title}" aria-label="${title}">
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
