import { PubSubServices } from '../services';
import type { Callback } from '../types';
import { isEmpty } from '../utils';
import type { Action, ActionCallback, Actions, ActionType } from './create-action.state';
import { updateState } from './update-state.utils';

class StateManagementStore<T> {
    private readonly actions: Actions<T> = new Map<ActionType, ActionCallback<T>>();
    private readonly observable: PubSubServices = new PubSubServices();
    private readonly storeName: string;
    private _state: Readonly<T> = {} as Readonly<T>;

    private set state(state: Partial<T>) {
        this._state = updateState<T>(this._state, state);
        this.observable.publish(this.storeName, this._state);
    }

    constructor(storeName: string, initialState: Readonly<T>, ...actions: ReadonlyArray<Action<T>>) {
        this.storeName = storeName;
        this.state = initialState;
        this.loadActions(actions);
    }

    dispatch(type: string, payload: T): void {
        if (!this.actions.has(type)) {
            console.error(`[Action Not Found]: ${type}`);
        }
        const action: ActionCallback<T> = this.actions.get(type)!;
        this.state = action(payload);
    }

    getCurrentValue(): T {
        return structuredClone<T>(this._state);
    }

    subscribe(callback: Callback<T>): void {
        this.observable.subscribe(this.storeName, callback);
    }

    private loadActions(actions: ReadonlyArray<Action<T>>): void {
        if (isEmpty(actions)) throw Error('No actions provided');
        for (const { type, callback } of actions) {
            this.actions.set(type, callback);
        }
    }
}

export function createStore<T>(
    storeName: string,
    initialState: Readonly<T>,
    ...actions: ReadonlyArray<Action<T>>
): StateManagementStore<T> {
    return new StateManagementStore<T>(storeName, initialState, ...actions);
}
