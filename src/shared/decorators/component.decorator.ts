import { isUndefined } from '@shared/utils';

export type ComponentParams = {
    selector: string;
    options?: ElementDefinitionOptions;
};
export type ComponentDecoratorFunc = (target: CustomElementConstructor) => void;

export function Component({ selector, options }: ComponentParams): ComponentDecoratorFunc {
    return (target: CustomElementConstructor): void => {
        if (isUndefined(customElements.get(selector))) {
            customElements.define(selector, target, options);
        }
    };
}
