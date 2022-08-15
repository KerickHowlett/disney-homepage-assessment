import type { State } from '@common/types';
import { merge } from '@common/utils';

export function updateState<TState extends State = State>(
    originalState: TState,
    updatedState: Partial<TState>,
): TState {
    const newState: TState = merge(originalState, updatedState);
    return Object.freeze<TState>(newState);
}
