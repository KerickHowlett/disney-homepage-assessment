import { changeDetectedBetween, Component, elementFactory, ImageComponent, isNull } from '@disney/shared';

@Component({
    selector: 'disney-content-tile-image',
    options: { extends: 'img' },
})
export class ContentTileImageComponent extends ImageComponent {
    private _contentTitle: string | null = null;

    get contentTitle(): string | null {
        return this._contentTitle;
    }

    set contentTitle(title: string | null) {
        this.alt = title ?? '';
        this.ariaLabel = title;
        this._contentTitle = title;
    }

    get failsafeImageTitleElement(): HTMLElement | null {
        return this.host.querySelector('.image-failsafe-title');
    }

    get host(): ParentNode {
        return this.parentNode!;
    }

    static get observedAttributes(): string[] {
        return ['content-title', 'failsafe-src', 'src'];
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (!changeDetectedBetween(oldValue, newValue)) return;
        switch (name) {
            case 'content-title':
                this.contentTitle = newValue;
                break;
            case 'failsafe-src':
                this.failsafeImage = newValue;
                break;
            case 'src':
                this.src = newValue;
                break;
        }
    }

    connectedCallback(): void {
        this.bindContentTileImageEventHandlers();
    }

    private bindContentTileImageEventHandlers(): void {
        this.onload = this.onImageLoad.bind(this);
        this.onerror = this.onImageError.bind(this);
    }

    private createTitleOverlayElement(title: string): void {
        this.host.append(
            elementFactory({
                classes: ['image-failsafe-title'],
                body: title,
                tagName: 'span',
            }),
        );
    }

    private onImageError(): void {
        this.renderFailsafeImage();
        this.renderTitleOverlay();
    }

    private onImageLoad(): void {
        if (isNull(this.failsafeImageTitleElement)) return;
        if (isNull(this.failsafeImage)) return;
        if (this.src.includes(this.failsafeImage)) return;
        this.style.removeProperty('filter');
        this.failsafeImageTitleElement.remove();
    }

    private renderTitleOverlay(): void {
        if (isNull(this.contentTitle)) return;
        if (!isNull(this.failsafeImageTitleElement)) return;
        this.style.setProperty('filter', 'brightness(65%)');
        this.createTitleOverlayElement(this.contentTitle);
    }
}
