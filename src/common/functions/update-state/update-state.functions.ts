import type { ThisObject, ValueOf } from '@common/types';
import { deepClone } from '../deep-clone';
import { isMap } from '../is-map';

export function updateState<TState extends ThisObject<TState>>(
    stateValueUpdate: unknown,
    property: keyof TState,
    originalState: Readonly<TState>,
): Readonly<TState> {
    const newState: TState = deepClone<TState>(originalState);
    const newStateProperty: unknown = newState[property];
    const clonedUpdate: unknown = deepClone(stateValueUpdate);

    if (isMap(clonedUpdate) && isMap(newStateProperty)) {
        clonedUpdate.forEach((updatedValue: ValueOf<TState>, key: unknown): void => {
            newStateProperty.set(key, deepClone(updatedValue));
        });
        return Object.freeze<TState>(deepClone<TState>(newState));
    }

    newState[property] = deepClone<ValueOf<TState>>(stateValueUpdate as ValueOf<TState>);
    return Object.freeze<TState>(deepClone<TState>(newState));
}
