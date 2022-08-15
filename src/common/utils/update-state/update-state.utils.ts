import type { ThisObject, ValueOf } from '@common/types';
import { isMap } from '../is-map';

export function updateState<TState extends ThisObject<TState>>(
    stateValueUpdate: unknown,
    property: keyof TState,
    originalState: Readonly<TState>,
): Readonly<TState> {
    const newState: TState = structuredClone<TState>(originalState);
    const newStateProperty: unknown = newState[property];
    const clonedUpdate: unknown = structuredClone(stateValueUpdate);

    if (isMap(clonedUpdate) && isMap(newStateProperty)) {
        clonedUpdate.forEach((updatedValue: ValueOf<TState>, key: unknown): void => {
            newStateProperty.set(key, structuredClone(updatedValue));
        });
        return Object.freeze<TState>(structuredClone<TState>(newState));
    }

    newState[property] = structuredClone<ValueOf<TState>>(stateValueUpdate as ValueOf<TState>);
    return Object.freeze<TState>(structuredClone<TState>(newState));
}
