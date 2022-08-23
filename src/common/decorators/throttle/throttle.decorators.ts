import type { OriginalMethod } from '@common/types';

const DEFAULT_TIMEOUT = 250;
export function Throttle(delay?: number): MethodDecorator {
    let paused = false;
    return function (
        // eslint-disable-next-line @typescript-eslint/ban-types
        _target: Object,
        _propertyKey: string | symbol,
        descriptor: PropertyDescriptor,
    ): PropertyDescriptor {
        const original: OriginalMethod = descriptor.value;

        descriptor.value = function throttle(...args: any[]): void {
            if (paused) return;
            paused = true;
            original.apply(this, args);
            setTimeout(() => {
                paused = false;
            }, delay || DEFAULT_TIMEOUT);
        };

        return descriptor;
    };
}
