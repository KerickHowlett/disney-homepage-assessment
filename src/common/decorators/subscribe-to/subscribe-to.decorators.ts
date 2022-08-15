import { PubSub } from '@common/events';
import type { OriginalMethod } from '@common/types';

export function SubscribeTo(eventName: string, messenger: PubSub = new PubSub()): MethodDecorator {
    return (
        // eslint-disable-next-line @typescript-eslint/ban-types
        _target: Object,
        _propertyKey: string | symbol,
        methodDescriptor: PropertyDescriptor,
    ): PropertyDescriptor => {
        const originalMethod: OriginalMethod = methodDescriptor.value;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        methodDescriptor.value = function (...args: any[]) {
            const result: unknown = originalMethod.apply(this, args);
            messenger.subscribe(eventName, () => result);
            return result;
        };

        return methodDescriptor;
    };
}
