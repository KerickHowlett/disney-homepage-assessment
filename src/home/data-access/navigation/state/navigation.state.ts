import type { ContentStateKey } from '../../store';

export interface NavigationState {
    readonly column: number; // Content Index Starting at 1.
    readonly row: number; // Collection Index Starting at 1.
    readonly selectedContentId: ContentStateKey | null;
}

export const getInitialNavigationState = (): NavigationState => ({
    column: 1,
    row: 1,
    selectedContentId: null,
});
