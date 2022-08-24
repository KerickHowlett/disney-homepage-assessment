import { Singleton } from '@common/decorators';
import { isNil, updateState } from '@common/utils';
import { DOMQuery, getCollectionsList, getInteractiveTilesFromFirstCollection } from '@disney/features/home/utils';
import type { HomeControlsState } from '../state';

function clamp(value: number, min?: number, max?: number): number {
    return Math.max(Math.min(value, max || Number.MAX_SAFE_INTEGER), min || 0);
}

export type HorizontalPayload = 'LEFT' | 'RIGHT';
export type VerticalPayload = 'UP' | 'DOWN';
export type Direction = HorizontalPayload | VerticalPayload;

@Singleton()
export class HomeControlsActions {
    moveHorizontally(state: HomeControlsState, direction: HorizontalPayload): Readonly<HomeControlsState> {
        const moveToColumn: number = state.column + (direction === 'LEFT' ? -1 : 1);
        const totalTiles: number = this.getTotalInteractiveTilesInFirstCollection();
        return updateState<HomeControlsState>(state, { column: clamp(moveToColumn, 1, totalTiles) });
    }

    moveVertically(state: HomeControlsState, direction: VerticalPayload): Readonly<HomeControlsState> {
        const moveToRow: number = state.row + (direction === 'UP' ? -1 : 1);
        const totalCollections: number = this.getTotalRenderedCollections();
        return updateState<HomeControlsState>(state, { row: clamp(moveToRow, 1, totalCollections) });
    }

    private getTotalRenderedCollections(): number {
        const collectionsList: ShadowRoot = getCollectionsList() as ShadowRoot;
        return collectionsList.querySelectorAll('disney-collection').length;
    }

    private getTotalInteractiveTilesInFirstCollection(): number {
        const interactiveTilesFromFirstCollection: DOMQuery<HTMLElement[]> = getInteractiveTilesFromFirstCollection();
        if (isNil(interactiveTilesFromFirstCollection)) return 0;
        return interactiveTilesFromFirstCollection.length;
    }
}
