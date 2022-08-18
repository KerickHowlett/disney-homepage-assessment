import { Component } from '@common/decorators';
import { isNull } from '@common/utils';

@Component({
    selector: 'disney-image',
    options: { extends: 'img' },
})
export class ImageComponent extends HTMLImageElement {
    constructor() {
        super();
    }

    private readonly failsafeImage: string | null = this.getAttribute('failsafe-src');
    private readonly failsafeTitle: string | null = this.getAttribute('alt');

    connectedCallback(): void {
        this.onerror = this.renderFailsafeImage.bind(this);
    }

    renderFailsafeImage(): void {
        if (isNull(this.failsafeImage) || isNull(this.failsafeTitle)) return;
        this.src = this.failsafeImage;
    }
}
