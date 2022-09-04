// @NOTE: Need to implement means of performing a deep merge/clone.
export function updateState<TState>(originalState: TState, updatedState: Partial<TState>): TState {
    const newState: TState = Object.assign({}, originalState, updatedState);
    return Object.freeze<TState>(newState);
}
