import { Singleton } from '@common/decorators';
import { clamp, isNil, isUndefined, updateState } from '@common/utils';
import type { ContentStateKey } from '@disney/features/home/types';
import type { ContentTileComponent } from '@disney/features/home/ui/content-tile';
import type { DOMQuery } from '@disney/features/home/utils';
import {
    getCollectionsList,
    getContentTilesFromNthCarousel,
    getFullyVisibleTilesFromNthCarousel,
} from '@disney/features/home/utils';
import type { HomeControlsState } from '../state';

const DEFAULT_CONTENT_ID: ContentTileComponent = { contentIndex: 1 } as ContentTileComponent;

export type Column = HomeControlsState['column'];
export type Direction = HorizontalPayload | VerticalPayload;
export type HorizontalPayload = 'LEFT' | 'RIGHT';
export type Row = HomeControlsState['row'];
export type SelectedContentId = HomeControlsState['selectedContentId'];
export type VerticalPayload = 'UP' | 'DOWN';

// @TODO: This needs a robust/dynamic means of memoization that can handle
//        ResizeObserver and IntersectionObserver events for better performance.
@Singleton()
export class HomeControlsActions {
    moveHorizontally(state: HomeControlsState, direction: HorizontalPayload): Readonly<HomeControlsState> {
        const moveToColumn: number = state.column + (direction === 'LEFT' ? -1 : 1);
        const totalTiles: number = this.getAllTilesInCurrentCollection(state.row);

        const targetColumn: Column = clamp(moveToColumn, 1, totalTiles);
        const selectedContentId: SelectedContentId = this.getSelectedContentId(state.row, targetColumn);

        return updateState<HomeControlsState>(state, {
            column: targetColumn,
            selectedContentId,
        });
    }

    moveVertically(state: HomeControlsState, direction: VerticalPayload): Readonly<HomeControlsState> {
        const moveToRow: number = state.row + (direction === 'UP' ? -1 : 1);
        const totalCollections: number = this.getTotalRenderedCollections();
        const targetCollectionIndex: number = clamp(moveToRow, 1, totalCollections);

        const targetContentIndex: number = this.getContentIndexInTargetCollection(moveToRow, state);
        const selectedContentId: SelectedContentId = this.getSelectedContentId(state.row, targetContentIndex);

        return updateState<HomeControlsState>(state, {
            column: targetContentIndex,
            row: targetCollectionIndex,
            selectedContentId,
        });
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

    private getSelectedContentId(row: Row, column: Column): ContentStateKey | null {
        const contentTiles: DOMQuery<ContentTileComponent[]> = getContentTilesFromNthCarousel(row - 1) as DOMQuery<
            ContentTileComponent[]
        >;
        if (isNil(contentTiles)) return null;

        const selectedContentElement: ContentTileComponent = contentTiles[column - 1];
        if (isNil(selectedContentElement)) return null;

        return selectedContentElement.contentId;
    }

    private getTotalRenderedCollections(): number {
        const collectionsList: ShadowRoot = getCollectionsList() as ShadowRoot;
        const collections: NodeListOf<HTMLElement> = collectionsList.querySelectorAll('disney-collection');
        return collections.length;
    }

    private getVerticallyAligningContentTileFromTargetCollection(
        targetCollectionIndex: number,
        originalCollectionFullyVisibleIndex: number,
    ): ContentTileComponent {
        const fullyVisibleTilesFromTargetCollection: DOMQuery<ContentTileComponent[]> =
            getFullyVisibleTilesFromNthCarousel(targetCollectionIndex - 1);
        if (isNil(fullyVisibleTilesFromTargetCollection)) return DEFAULT_CONTENT_ID;

        const selectedContentElement: ContentTileComponent =
            fullyVisibleTilesFromTargetCollection[originalCollectionFullyVisibleIndex];
        if (isUndefined(selectedContentElement)) return DEFAULT_CONTENT_ID;

        return fullyVisibleTilesFromTargetCollection[originalCollectionFullyVisibleIndex];
    }
}
