export interface HomeControlsState {
    readonly column: number; // Content Tile
    readonly row: number; // Collection
}

export const getInitialCoordinatesState = (): HomeControlsState => ({ column: 1, row: 1 });
