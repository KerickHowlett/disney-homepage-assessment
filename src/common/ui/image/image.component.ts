import { Component } from '@common/decorators';
import { changeDetectedBetween, isNull } from '@common/utils';

@Component({
    selector: 'disney-image',
    options: { extends: 'img' },
})
export class ImageComponent extends HTMLImageElement {
    private _failsafeImage: string | null = null;

    get failsafeImage(): string | null {
        return this._failsafeImage || null;
    }

    set failsafeImage(imageSrc: string | null) {
        this._failsafeImage = imageSrc;
    }

    static get observedAttributes(): string[] {
        return ['failsafe-src'];
    }

    attributeChangedCallback(_name: string, oldValue: string, newValue: string): void {
        if (!changeDetectedBetween(oldValue, newValue)) return;
        this._failsafeImage = newValue;
    }

    connectedCallback(): void {
        this.bindImageEventHandlers();
    }

    protected renderFailsafeImage(): void {
        if (isNull(this.failsafeImage)) {
            console.error('Failsafe Image was not set.');
            return;
        }
        this.src = this.failsafeImage;
    }

    private bindImageEventHandlers(): void {
        this.onerror = this.renderFailsafeImage.bind(this);
    }
}
