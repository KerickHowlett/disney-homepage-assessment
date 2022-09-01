import { changeDetectedBetween, Component, Debounce } from '@disney/common';

import css from './marquee-content-preview.component.css?inline';

@Component({
    selector: 'disney-marquee-content-preview',
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
                this.videoElement.poster = newValue;
                break;
            case 'video':
                return this.onVideoSrcChange(newValue);
        }
    }

    connectedCallback(): void {
        this.render();
    }

    render(): void {
        this.element.innerHTML = `
            <style>${css}</style>
            <video id="video-preview" class="video-preview" muted loop crossorigin="anonymous">
                <source src="" type="video/mp4">
            </video>
        `;
    }

    @Debounce(1500)
    private onVideoSrcChange(videoSrc: string): void {
        this.videoElement.pause();
        this.videoSourceElement.setAttribute('src', videoSrc);
        this.videoSourceElement.setAttribute('type', 'video/mp4');
        this.videoElement.load();
        this.videoElement.play();
    }
}
