import { changeDetectedBetween, Component, isEmpty } from '@disney/shared';

import '@disney/shared/ui/image';

import css from './marquee-content-preview.component.css?inline';

@Component({
    selector: 'disney-marquee-preview',
})
export class MarqueeContentPreviewComponent extends HTMLElement {
    private readonly element: ShadowRoot;

    constructor() {
        super();
        this.element = this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes(): string[] {
        return ['image', 'title', 'video'];
    }

    get imageElement(): HTMLImageElement {
        return this.element.querySelector('img')!;
    }

    get videoElement(): HTMLVideoElement {
        return this.element.querySelector('video')!;
    }

    get videoSourceElement(): HTMLSourceElement {
        return this.videoElement.querySelector('source')!;
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (!changeDetectedBetween(oldValue, newValue)) return;
        switch (name) {
            case 'image':
                return this.onPosterSrcChange(newValue);
            case 'video':
                return this.onVideoSrcChange(newValue);
        }
    }

    connectedCallback(): void {
        this.render();
        this.bindVideoEventHandlers();
    }

    render(): void {
        this.element.innerHTML = `
            <style>${css}</style>
            <video id="video-preview" class="video-preview" muted loop>
                <source type="video/mp4">
            </video>
            <img
                alt="Video Preview"
                aria-label="Video Preview"
                class="image-fallback video-preview"
                is="disney-image"
                id="image-fallback"
                loading="lazy"
                failsafe-src="/default-content-tile.jpeg"
                style="display: none;"
            />
        `;
    }

    private bindVideoEventHandlers(): void {
        this.videoElement.onerror = this.onError.bind(this);
        this.videoElement.onloadeddata = this.onSuccess.bind(this);
    }

    // @TODO: Add fade transition to hide video and show poster image, as well
    //        as means to replace video element with image of poster for error
    //        handling.
    private onVideoSrcChange(videoSrc: string): void {
        if (isEmpty(videoSrc)) return this.onError();
        this.videoSourceElement.setAttribute('src', videoSrc);
        this.videoElement.load();
    }

    private onError(): void {
        this.imageElement.style.display = 'block';
        this.videoElement.style.display = 'none';
    }

    private onPosterSrcChange(posterSrc: string): void {
        this.imageElement.src = posterSrc;
        this.videoElement.poster = posterSrc;
    }

    private onSuccess(): void {
        this.imageElement.style.display = 'none';
        this.videoElement.style.display = 'block';
        this.videoElement.play().catch(this.videoElement.pause.bind(this));
    }
}
