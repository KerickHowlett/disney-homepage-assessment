import type { ContentTileComponent } from '@disney/home/features';
import type { ActionType } from '@disney/shared';
import { createAction, isUndefined } from '@disney/shared';
import type { NavigationState } from '../state';
import { getNthContentTileFromNthCollection } from './utils';

export function selectElement(state: NavigationState, collectionIndex: number, contentIndex: number): NavigationState {
    const targetTile: ContentTileComponent = getNthContentTileFromNthCollection(collectionIndex - 1, contentIndex - 1)!;

    if (isUndefined(targetTile)) {
        console.error('Could not find content tile.');
        return state;
    }

    targetTile.imageElement.focus();

    return {
        column: contentIndex,
        row: collectionIndex,
        selectedContentId: targetTile.contentId,
    };
}

export const SELECT_ELEMENT: ActionType = 'SELECT_ELEMENT';
export const selectElementAction = createAction(SELECT_ELEMENT, selectElement);
