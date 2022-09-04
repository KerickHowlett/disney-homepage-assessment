import type { OriginalMethod } from './types';

type Timeout = ReturnType<typeof setTimeout>;
const DEFAULT_TIMEOUT = 100;
export function Debounce(delay?: number): MethodDecorator {
    return function (
        // eslint-disable-next-line @typescript-eslint/ban-types
        _target: Object,
        _propertyKey: string | symbol,
        descriptor: PropertyDescriptor,
    ): PropertyDescriptor {
        const original: OriginalMethod = descriptor.value;
        let timeoutId: Timeout | undefined;
        descriptor.value = function debounce(...args: any[]): void {
            clearTimeout(timeoutId);
            timeoutId = setTimeout((): void => {
                original.apply(this, args);
            }, delay || DEFAULT_TIMEOUT);
        };

        return descriptor;
    };
}
