import type { Content, ContentStateKey } from '@disney/home/data-access';
import { HomeNavigation, HomeStore } from '@disney/home/data-access';
import { changeDetectedBetween, Component, Debounce, isNil, isNull, isUndefined } from '@disney/shared';
import type { MarqueeContentInformationComponent, MarqueeContentPreviewComponent } from '../ui';

import css from './marquee.component.css?inline';

import '../ui';

@Component({
    selector: 'disney-marquee',
})
export class MarqueeComponent extends HTMLElement {
    private readonly element: ShadowRoot;
    private currentContentId: ContentStateKey | null = null;

    constructor(
        private readonly controls: HomeNavigation = new HomeNavigation(),
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
        return this.element.querySelector<MarqueeContentPreviewComponent>('disney-marquee-preview')!;
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
            <disney-marquee-preview></disney-marquee-preview>
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
