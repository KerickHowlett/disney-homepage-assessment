import { isNull } from '../functions';

export abstract class BaseComponent extends HTMLElement {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    constructor(..._args: any[]) {
        super();
        this.attachShadow({ mode: 'open' });
    }

    disableShadowDOM(): void {
        this.attachShadow({ mode: 'closed' });
    }

    enableShadowDOM(): void {
        this.attachShadow({ mode: 'open' });
    }

    render(template?: string): void {
        const root: this | ShadowRoot = isNull(this.shadowRoot) ? this : this.shadowRoot;
        root.innerHTML = template || '';
    }
}
