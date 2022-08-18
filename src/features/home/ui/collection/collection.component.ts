import '@common/ui/carousel';
import { changeDetectedBetween, Component, isNil, isUndefined } from '@disney/common';
import { HomeStore } from '../../store';
import type { Collection, Content } from '../../types';
import '../content-tile';

@Component({
    selector: 'disney-collection',
})
export class CollectionComponent extends HTMLElement {
    constructor(private readonly store: HomeStore = new HomeStore()) {
        super();
        this.store.effect$(this.render);
    }

    private _collection?: Readonly<Collection>;
    private collectionId?: string | null;

    private _content?: ReadonlyArray<Content>;
    get content(): ReadonlyArray<Content> {
        return this._content || [];
    }
    set content(content: ReadonlyArray<Content>) {
        this._content = content;
    }

    private _template?: string;
    get template(): string {
        return this._template || '';
    }
    set template(template: string) {
        this._template = template;
        this.innerHTML = template;
    }
    get collection(): Readonly<Collection> | undefined {
        return this._collection;
    }
    set collection(collection: Readonly<Collection> | undefined) {
        this._collection = collection;
        if (isUndefined(collection)) return;

        this.content = collection.content || [];
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (!changeDetectedBetween(oldValue, newValue)) return;
        if (this.isCollectionId(name)) {
            this.collectionId = newValue;
        }
        this.render();
    }

    connectedCallback(): void {
        this.collectionId = this.getAttribute('id');
        this.render();
    }

    readonly render = (): void => {
        const template: string = this.createTemplate();
        if (this.changeDetectedBetween(template)) {
            this.template = template;
        }
    };

    private createTemplate(): string {
        this.getCollection();
        if (isUndefined(this.collection) || !this.hasContent()) return '';
        return `
            <h4 class="text-color--primary">${this.collection.title}</h4>
            <div class="collection-content">
                <disney-carousel>
                    ${this.createContentTiles()}
                </disney-carousel>
            </div>
        `;
    }

    private changeDetectedBetween(newTemplate: string): boolean {
        return this.template !== newTemplate;
    }

    private createContentTiles(): string {
        return this.content
            .map((content: Content): string => {
                return `<disney-content-tile title="${content.title}" image="${content.image}"></disney-content-tile>`;
            })
            .join('\n');
    }

    private getCollection(): void {
        if (isNil(this.collectionId)) return;
        this.collection = this.store.getCollection(this.collectionId);
    }

    private hasContent(): boolean {
        return this.content.length > 0;
    }

    private isCollectionId(attributeName: string): boolean {
        return attributeName === 'id';
    }
}
