import { PubSub } from '@common/events';
import type { OriginalMethod } from '@common/types';

/**
 * @NOTE: This parameter is used as a quick workaround to allow for "Dependency
 *        Injection/Inversion" for this feature.
 * @param messenger
 */
export function PublishTo(eventName: string, messenger: PubSub = new PubSub()): MethodDecorator {
    return (
        // eslint-disable-next-line @typescript-eslint/ban-types
        _target: Object,
        _propertyKey: string | symbol,
        methodDescriptor: PropertyDescriptor,
    ): PropertyDescriptor => {
        const originalMethod: OriginalMethod = methodDescriptor.value;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        methodDescriptor.value = function (...args: any[]): unknown {
            const result: unknown = originalMethod.apply(this, args);
            messenger.publish(eventName, result);
            return result;
        };

        return methodDescriptor;
    };
}
