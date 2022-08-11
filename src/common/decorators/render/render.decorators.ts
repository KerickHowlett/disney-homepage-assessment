type HTMLRootElement = HTMLElement | ShadowRoot;
type RenderOptions = {
    shadowDOM: ShadowRootInit;
};
const DEFAULT_RENDER_OPTIONS: RenderOptions = {
    shadowDOM: { mode: 'open' },
};

export function Render(options: RenderOptions = DEFAULT_RENDER_OPTIONS) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/ban-types
    return function (target: HTMLElement, propertyKey: string): void {
        const template: HTMLTemplateElement = document.createElement('template');
        Object.defineProperty(target, Symbol('template'), {
            set: function (updatedTemplate: string): void {
                template.innerHTML = updatedTemplate || '';
                this.attachShadow(options.shadowDOM);
                const htmlRootElement: HTMLRootElement = this.shadowRoot ?? this;
                htmlRootElement.appendChild(template.content.cloneNode(true));
                customElements.upgrade(htmlRootElement);
            },
            get: function (): string | undefined {
                console.log('TEST-2');
                return '!!!!';
            },
            enumerable: true,
        });
    };
}
