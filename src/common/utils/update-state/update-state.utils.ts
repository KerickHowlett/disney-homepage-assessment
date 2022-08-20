import type { State } from '@common/types';

export function updateState<TState extends State = State>(
    originalState: TState,
    updatedState: Partial<TState>,
): TState {
    const newState: TState = Object.assign({}, originalState, updatedState);
    // const newState: TState = merge<TState>(originalState, updatedState);
    // console.dir(updatedState!.collections!.get("bd1bfb9a-bbf7-43a0-ac5e-3e3889d7224d"));
    // console.dir(newState.collections.get("bd1bfb9a-bbf7-43a0-ac5e-3e3889d7224d"));
    return Object.freeze<TState>(newState);
}
