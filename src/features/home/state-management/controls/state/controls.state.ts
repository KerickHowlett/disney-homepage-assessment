export interface HomeControlsState {
    readonly column: number; // Content Tile
    readonly row: number; // Collection
    readonly direction: 'UP' | 'DOWN' | 'START';
}

export const getInitialCoordinatesState = (): HomeControlsState => ({ column: 1, row: 1, direction: 'START' });
