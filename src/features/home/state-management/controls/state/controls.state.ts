import type { ContentStateKey } from '@disney/features/home/types';

export interface HomeControlsState {
    readonly column: number; // Content Index Starting at 1.
    readonly row: number; // Collection Index Starting at 1.
    readonly selectedContentId: ContentStateKey | null;
}

export const getInitialCoordinatesState = (): HomeControlsState => ({
    column: 1,
    row: 1,
    selectedContentId: null,
});
