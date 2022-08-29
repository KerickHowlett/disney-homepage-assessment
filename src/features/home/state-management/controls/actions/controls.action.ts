import { Singleton } from '@common/decorators';
import { clamp, isNil, updateState } from '@common/utils';
import type { ContentTileComponent } from '@disney/features/home/ui/content-tile';
import type { DOMQuery } from '@disney/features/home/utils';
import {
    getCollectionsList,
    getContentTilesFromNthCarousel,
    getFullyVisibleTilesFromNthCarousel,
} from '@disney/features/home/utils';
import type { HomeControlsState } from '../state';

export type HorizontalPayload = 'LEFT' | 'RIGHT';
export type VerticalPayload = 'UP' | 'DOWN';
export type Direction = HorizontalPayload | VerticalPayload;

@Singleton()
export class HomeControlsActions {
    moveHorizontally(state: HomeControlsState, direction: HorizontalPayload): Readonly<HomeControlsState> {
        const moveToColumn: number = state.column + (direction === 'LEFT' ? -1 : 1);
        const totalTiles: number = this.getAllTilesInCurrentCollection(state.row);
        return updateState<HomeControlsState>(state, { column: clamp(moveToColumn, 1, totalTiles) });
    }

    moveVertically(state: HomeControlsState, direction: VerticalPayload): Readonly<HomeControlsState> {
        const moveToRow: number = state.row + (direction === 'UP' ? -1 : 1);
        const totalCollections: number = this.getTotalRenderedCollections();
        const targetCollectionIndex: number = clamp(moveToRow, 1, totalCollections);

        const targetContentIndex: number = this.getContentIndexInTargetCollection(moveToRow, state);
        return updateState<HomeControlsState>(state, {
            column: targetContentIndex,
            row: targetCollectionIndex,
        });
    }

    private getTotalRenderedCollections(): number {
        const collectionsList: ShadowRoot = getCollectionsList() as ShadowRoot;
        return collectionsList.querySelectorAll('disney-collection').length;
    }

    private getAllTilesInCurrentCollection(collectionIndex: number): number {
        const totalTilesFromCurrentCollection: DOMQuery<HTMLElement[]> = getContentTilesFromNthCarousel(
            collectionIndex - 1,
        );
        if (isNil(totalTilesFromCurrentCollection)) return 0;
        return totalTilesFromCurrentCollection.length;
    }

    private getContentIndexInTargetCollection(targetCollectionIndex: number, state: HomeControlsState): number {
        const { row: originalCollectionIndex, column: targetContentIndex } = state;
        const originalCollectionFullyVisibleIndex: number = this.getIndexForFullyVisibleContentTileInNthCollection(
            originalCollectionIndex,
            targetContentIndex,
        );
        const { contentIndex } = this.getVerticallyAligningContentTileFromTargetCollection(
            targetCollectionIndex,
            originalCollectionFullyVisibleIndex,
        );
        return contentIndex;
    }

    private getIndexForFullyVisibleContentTileInNthCollection(
        collectionIndex: number,
        targetContentIndex: number,
    ): number {
        const fullyVisibleTilesFromOriginalCollection: DOMQuery<ContentTileComponent[]> =
            getFullyVisibleTilesFromNthCarousel(collectionIndex - 1);

        if (isNil(fullyVisibleTilesFromOriginalCollection)) return 0;

        const index: number = fullyVisibleTilesFromOriginalCollection.findIndex(
            (contentTile: ContentTileComponent): boolean => {
                return targetContentIndex === contentTile.contentIndex;
            },
        );

        return index === -1 ? 0 : index;
    }

    private getVerticallyAligningContentTileFromTargetCollection(
        targetCollectionIndex: number,
        originalCollectionFullyVisibleIndex: number,
    ): ContentTileComponent {
        const fullyVisibleTilesFromTargetCollection: DOMQuery<ContentTileComponent[]> =
            getFullyVisibleTilesFromNthCarousel(targetCollectionIndex - 1);

        if (isNil(fullyVisibleTilesFromTargetCollection)) {
            return { contentIndex: 0 } as ContentTileComponent;
        }

        return fullyVisibleTilesFromTargetCollection[originalCollectionFullyVisibleIndex];
    }
}
