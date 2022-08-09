type ComponentArgs = {
    selector: string;
    children?: string[] | string;
    options?: ElementDefinitionOptions;
};
type ComponentDecoratorFunc = (target: CustomElementConstructor) => void;

export function Component({ selector, options }: ComponentArgs): ComponentDecoratorFunc {
    return (target: CustomElementConstructor): void => customElements.define(selector, target, options);
}
