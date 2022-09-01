import { Singleton } from '@common/decorators';
import { changeDetectedBetween, clamp, isNil, isUndefined, updateState } from '@common/utils';
import type { ContentTileComponent } from '@disney/features/home/ui/content-tile';
import {
    DOMQuery,
    getCollectionsList,
    getContentTilesFromNthCarousel,
    getFullyVisibleTilesFromNthCarousel,
    getNthContentTileFromNthCollection,
} from '@disney/features/home/utils';
import type { HomeControlsState } from '../state';

const DEFAULT_CONTENT_ID: ContentTileComponent = { contentIndex: 1 } as ContentTileComponent;

type HorizontalPayload = 'LEFT' | 'RIGHT';
type VerticalPayload = 'UP' | 'DOWN';

// @TODO: This needs a robust/dynamic means of memoization that can handle
//        ResizeObserver and IntersectionObserver events for better performance.
@Singleton()
export class HomeControlsActions {
    moveHorizontally(state: HomeControlsState, direction: HorizontalPayload): Readonly<HomeControlsState> {
        const moveToColumn: number = state.column + (direction === 'LEFT' ? -1 : 1);
        const totalTiles: number = this.getAllTilesInCurrentCollection(state.row);

        const targetColumn: number = clamp(moveToColumn, 1, totalTiles);
        return this.selectElement(state, state.row, targetColumn);
    }

    moveVertically(state: HomeControlsState, direction: VerticalPayload): Readonly<HomeControlsState> {
        const moveToRow: number = state.row + (direction === 'UP' ? -1 : 1);
        const totalCollections: number = this.getTotalRenderedCollections();
        const targetCollectionIndex: number = clamp(moveToRow, 1, totalCollections);

        if (!changeDetectedBetween(targetCollectionIndex, state.row) && targetCollectionIndex === 1) return state;

        const targetContentIndex: number = this.getContentIndexInTargetCollection(moveToRow, state);
        return this.selectElement(state, targetCollectionIndex, targetContentIndex);
    }

    selectElement(state: HomeControlsState, collectionIndex: number, contentIndex: number): HomeControlsState {
        const targetTile: ContentTileComponent = getNthContentTileFromNthCollection(
            collectionIndex - 1,
            contentIndex - 1,
        )!;

        if (isUndefined(targetTile)) {
            console.error('Could not find content tile.');
            return state;
        }

        targetTile.imageElement.focus();

        return updateState<HomeControlsState>(state, {
            column: contentIndex,
            row: collectionIndex,
            selectedContentId: targetTile.contentId,
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
