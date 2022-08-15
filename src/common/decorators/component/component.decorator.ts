import { ComponentDecoratorFunc, ComponentParams } from '@common/types';
import { isUndefined } from '@common/utils';

export function Component({ selector, options }: ComponentParams): ComponentDecoratorFunc {
    return (target: CustomElementConstructor): void => {
        if (isUndefined(customElements.get(selector))) {
            customElements.define(selector, target, options);
        }
    };
}
