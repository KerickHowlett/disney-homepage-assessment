// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Callback<T = any> = (...args: any[]) => T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T = any> = Callback<T>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ClassType<T = any> = new (...args: any[]) => T;

export type ComponentParams = {
    selector: string;
    options?: ElementDefinitionOptions;
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
export type InternalStoreEvents = Map<string, ReadonlyArray<Callback>>;
export type PubSubEvents = ReadonlyMap<string, ReadonlyArray<Callback>>;
export type RootHTML = HTMLElement | ShadowRoot;

export type ValueOf<T> = T[keyof T];
export type ThisObject<S> = Record<keyof S, ValueOf<S>>;
export type ObjectKeys<S extends Record<keyof S, ValueOf<S>>> = Array<keyof S>;

export interface Action<A extends string, P = never> {
    type: A;
    payload: P | null;
}
export type OnAction<A extends string> = Record<A, A>;
