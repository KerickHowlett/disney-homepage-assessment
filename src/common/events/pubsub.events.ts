import { Singleton } from '@common/decorators';
import type { Callback, InternalStoreEvents, PubSubEvents } from '../types';

@Singleton()
export class PubSub {
    constructor(private readonly events: InternalStoreEvents = new Map<string, ReadonlyArray<Callback>>()) {}

    subscribe(event: string, callback: Callback): PubSubEvents {
        const currentCallbacks: ReadonlyArray<Callback> = this.getCurrentCallbacks(event);
        this.events.set(event, [...currentCallbacks, callback]);
        return Object.freeze(new Map(this.events));
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    publish<TReturn = unknown>(event: string, ...args: any[]): ReadonlyArray<TReturn> {
        const callbacks: ReadonlyArray<Callback> = this.getCurrentCallbacks(event);
        return callbacks.map<TReturn>((callback: Callback): TReturn => callback(...args));
    }

    private getCurrentCallbacks(event: string): ReadonlyArray<Callback> {
        return Object.freeze(this.events.get(event) || []);
    }
}
