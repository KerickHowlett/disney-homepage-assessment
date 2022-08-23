import type { State } from '@common/types';

export function updateState<TState extends State = State>(
    originalState: TState,
    updatedState: Partial<TState>,
): TState {
    const newState: TState = Object.assign({}, originalState, updatedState);
    return Object.freeze<TState>(newState);
}
