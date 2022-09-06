import { Singleton } from '@disney/shared/decorators';
import type { Callback } from '@shared/types';

type InternalStoreEvents = Map<string, ReadonlyArray<Callback>>;

export type PubSubEvents = ReadonlyMap<string, ReadonlyArray<Callback>>;

@Singleton()
export class PubSubServices {
    constructor(private readonly events: InternalStoreEvents = new Map<string, ReadonlyArray<Callback>>()) {}

    publish<TReturn = unknown>(event: string, ...args: any[]): ReadonlyArray<TReturn> {
        const callbacks: ReadonlyArray<Callback> = this.getCurrentCallbacks(event);
        return callbacks.map<TReturn>((callback: Callback): TReturn => callback(...args));
    }

    subscribe(event: string, callback: Callback): PubSubEvents {
        const currentCallbacks: ReadonlyArray<Callback> = this.getCurrentCallbacks(event);
        this.events.set(event, [...currentCallbacks, callback]);
        return new Map<string, ReadonlyArray<Callback>>(this.events);
    }

    unsubscribe(event: string, callback: Callback): PubSubEvents {
        const currentCallbacks: ReadonlyArray<Callback> = this.getCurrentCallbacks(event);
        this.events.set(
            event,
            currentCallbacks.filter((cb: Callback): boolean => cb !== callback),
        );
        return new Map<string, ReadonlyArray<Callback>>(this.events);
    }

    private getCurrentCallbacks(event: string): ReadonlyArray<Callback> {
        return Object.freeze<ReadonlyArray<Callback>>(this.events.get(event) || []);
    }
}
