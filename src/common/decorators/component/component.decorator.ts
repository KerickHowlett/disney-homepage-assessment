import { isUndefined } from '@common/functions';
import { ComponentDecoratorFunc, ComponentParams } from '@common/types';

export function Component({ selector, options }: ComponentParams): ComponentDecoratorFunc {
    return (target: CustomElementConstructor): void => {
        if (isUndefined(customElements.get(selector))) {
            return customElements.define(selector, target, options);
        }
    };
}
