import type { Callback } from '@shared/types';
import { PubSubServices } from '../services';
import { isEmpty } from '../utils';
import type { Action, ActionCallback, Actions, ActionType } from './create-action.state';
import { updateState } from './update-state.utils';

class StateReducer<T> {
    private readonly actions: Actions = new Map<ActionType, ActionCallback>();
    private readonly observable: PubSubServices = new PubSubServices();
    private readonly storeName: string;
    private _state: Readonly<T> = {} as Readonly<T>;

    get state(): Readonly<T> {
        return structuredClone(this._state);
    }

    private set state(state: Partial<T>) {
        this._state = updateState<T>(this._state, state);
        this.observable.publish(this.storeName, this._state);
    }

    constructor(storeName: string, initialState: Readonly<T>, ...actions: ReadonlyArray<Action>) {
        this.storeName = storeName;
        this.state = initialState;
        this.loadActions(actions);
    }

    dispatch(type: string, ...payload: any[]): void {
        const action: ActionCallback = this.actions.get(type)!;
        // @NOTE: The "Promise.resolve()" is to cover any possible instances
        //        where an action method might be async.
        const actionResponse: T | Promise<T> = Promise.resolve(action(...payload));
        actionResponse
            .then((state: T): void => {
                this.state = state;
            })
            .catch((error: Error): void => console.error(error));
    }

    getCurrentValue(): T {
        return structuredClone(this._state);
    }

    publish(): void {
        this.observable.publish(this.storeName, this._state);
    }

    subscribe(callback: Callback<T>): void {
        this.observable.subscribe(this.storeName, callback);
    }

    unsubscribe(callback: Callback<T>): void {
        this.observable.unsubscribe(this.storeName, callback);
    }

    private loadActions(actions: ReadonlyArray<Action>): void {
        if (isEmpty(actions)) throw Error('No actions provided');
        for (const { type, callback } of actions) {
            this.actions.set(type, callback);
        }
    }
}

export type { StateReducer };
export function createReducer<T>(
    storeName: string,
    initialState: Readonly<T>,
    ...actions: ReadonlyArray<Action>
): StateReducer<T> {
    return new StateReducer<T>(storeName, initialState, ...actions);
}
