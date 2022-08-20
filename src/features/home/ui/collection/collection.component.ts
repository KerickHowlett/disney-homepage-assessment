import { changeDetectedBetween, Component, isEmpty, isNull, isUndefined, templateElementFactory } from '@disney/common';
import { COLLECTION_ID } from '../../constants';
import { HomeStore } from '../../store';
import type { Collection, CollectionId, Content } from '../../types';

// Child Component Imports
import '@common/ui/carousel';
import '../content-tile';

@Component({
    selector: 'disney-collection',
})
export class CollectionComponent extends HTMLElement {
    constructor(private readonly store: HomeStore = new HomeStore()) {
        super();
    }

    private collectionId?: CollectionId;
    private collection?: Readonly<Collection>;

    static get observedAttributes(): string[] {
        return [COLLECTION_ID];
    }

    connectedCallback(): void {
        const collectionId: CollectionId | null = this.getAttribute(COLLECTION_ID);
        if (isNull(collectionId)) {
            console.error('Collection ID is required');
            return;
        }
        this.collectionId = collectionId;
        this.render();
    }

    render(): void {
        if (isUndefined(this.collectionId)) {
            this.hideCollection();
            return;
        }

        this.collection = this.store.getCollection(this.collectionId);
        if (isUndefined(this.collection) || isEmpty(this.collection)) {
            console.log(typeof this.collection?.content);
            this.hideCollection();
            return;
        }

        const template: HTMLTemplateElement = this.createTemplate(this.collection);
        if (!changeDetectedBetween(this.innerHTML, template.innerHTML)) return;

        this.innerHTML = template.innerHTML;
    }

    private createContentTile({ image, title }: Readonly<Content>): HTMLElement {
        const contentTile: HTMLElement = document.createElement('disney-content-tile');
        contentTile.setAttribute('content-image-src', image);
        contentTile.setAttribute('content-title', title);
        return contentTile;
    }

    private createContentTiles(content: ReadonlyArray<Content>): string {
        const template: HTMLTemplateElement = templateElementFactory();
        for (const tile of content) {
            const contentTileElement: HTMLElement = this.createContentTile(tile);
            template.content.appendChild(contentTileElement);
        }
        return template.innerHTML;
    }

    private createTemplate({ content, title }: Readonly<Collection>): HTMLTemplateElement {
        const template: HTMLTemplateElement = templateElementFactory({ styles: ['display: none'] });
        if (isUndefined(content)) return template;

        template.style.display = 'block';
        template.innerHTML = `
            <h4 class="text-color--primary">${title}</h4>
            <div class="collection-content">
                <disney-carousel>
                    ${this.createContentTiles(content)}
                </disney-carousel>
            </div>
        `;

        return template;
    }

    private hideCollection(): void {
        this.style.display = 'none';
        this.innerHTML = '';
    }
}
