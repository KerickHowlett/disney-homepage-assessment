import { changeDetectedBetween, Component, Debounce, isNil, isNull, isUndefined } from '@disney/common';
import { HomeControls, HomeStore } from '../../state-management';
import type { Content, ContentStateKey } from '../../types';
import type { MarqueeContentInformationComponent } from '../marquee-content-information';
import type { MarqueeContentPreviewComponent } from '../marquee-content-preview';

import css from './marquee.component.css?inline';

import '../marquee-content-information';
import '../marquee-content-preview';

@Component({
    selector: 'disney-marquee',
})
export class MarqueeComponent extends HTMLElement {
    private readonly element: ShadowRoot;
    private currentContentId: ContentStateKey | null = null;

    constructor(
        private readonly controls: HomeControls = new HomeControls(),
        private readonly store: HomeStore = new HomeStore(),
    ) {
        super();
        this.element = this.attachShadow({ mode: 'open' });
        this.controls.subscribe(this.updateAttributes.bind(this));
    }

    get content(): Readonly<Content> | null {
        if (isNull(this.contentId)) return null;
        return this.store.getContent(this.contentId)!;
    }

    get contentId(): ContentStateKey | null {
        return this.controls.selectedContentId;
    }

    get contentInformationElement(): MarqueeContentInformationComponent {
        return this.element.querySelector<MarqueeContentInformationComponent>('disney-marquee-content-information')!;
    }

    get contentPreviewElement(): MarqueeContentPreviewComponent {
        return this.element.querySelector<MarqueeContentPreviewComponent>('disney-marquee-content-preview')!;
    }

    connectedCallback(): void {
        this.render();
        this.updateAttributes();
    }

    disconnectedCallback(): void {
        this.store.unsubscribe(this.updateAttributes.bind(this));
        this.controls.unsubscribe(this.updateAttributes.bind(this));
    }

    render(): void {
        this.element.innerHTML = `
            <style>${css}</style>
            <div id="content-information" class="content-information">
                <disney-marquee-content-information></disney-marquee-content-information>
            </div>
            <disney-marquee-content-preview></disney-marquee-content-preview>
        `;
    }

    private contentIdChangeDetected(): boolean {
        return changeDetectedBetween(this.currentContentId ?? '', this.contentId ?? '');
    }

    @Debounce(300)
    private updateAttributes(): void {
        if (!this.contentIdChangeDetected()) return;
        this.currentContentId = this.contentId;
        this.updateContentInformation();
        this.updateContentPreview();
    }

    private updateContentInformation(): void {
        if (isNil(this.content)) return;
        this.contentInformationElement.setAttribute('content-title', this.content.title);
        this.contentInformationElement.setAttribute('title-treatment-image', this.content.titleTreatmentImage);

        if (isUndefined(this.content.rating)) return;
        this.contentInformationElement.setAttribute('rating', this.content.rating);
    }

    private updateContentPreview(): void {
        if (isNil(this.content)) return;
        this.contentPreviewElement.setAttribute('image', this.content.marqueePosterImage);
        if (isUndefined(this.content.video)) return;
        this.contentPreviewElement.setAttribute('video', this.content.video);
    }
}
