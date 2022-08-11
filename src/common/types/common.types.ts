export type ComponentParams = {
    selector: string;
    options?: ElementDefinitionOptions | undefined;
    view?: string;
};

export interface CustomElement {
    // eslint-disable-next-line @typescript-eslint/ban-types
    constructor: Function & {
        observedAttributes?: string[];
    };

    rootHtml: RootHTML;

    attributeChangedCallback?(attributeName: string, oldValue: string, newValue: string): void;

    connectedCallback?(): void;

    disconnectedCallback?(): void;

    render(): void;
}

export type ComponentDecoratorFunc = (target: CustomElementConstructor) => void;

export type RootHTML = HTMLElement | ShadowRoot;
