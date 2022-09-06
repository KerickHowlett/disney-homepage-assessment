import type { Action } from '@disney/shared';
import { changeDetectedBetween, clamp, createAction } from '@disney/shared';
import type { NavigationState } from '../state';
import { selectElement } from './select-element.actions';
import { countRenderedCollections, getContentIndexInTargetCollection } from './utils';

export type VerticalDirection = 'UP' | 'DOWN';

function moveVertically(state: NavigationState, moveToRow: number): Readonly<NavigationState> {
    const totalCollections: number = countRenderedCollections();
    const targetCollectionIndex: number = clamp(moveToRow, 1, totalCollections);

    if (!changeDetectedBetween(targetCollectionIndex, state.row) && targetCollectionIndex === 1) return state;

    const targetContentIndex: number = getContentIndexInTargetCollection(moveToRow, state);
    return selectElement(state, targetCollectionIndex, targetContentIndex);
}

export function moveUp(state: NavigationState): Readonly<NavigationState> {
    const previousRow: number = state.row - 1;
    return moveVertically(state, previousRow);
}

export function moveDown(state: NavigationState): Readonly<NavigationState> {
    const nextRow: number = state.row + 1;
    return moveVertically(state, nextRow);
}

export const moveUpActions: ReadonlyArray<Action> = [
    createAction('ArrowUp', moveUp),
    createAction('KeyW', moveUp),
    createAction('Numpad8', moveUp),
] as const;

export const moveDownActions: ReadonlyArray<Action> = [
    createAction('ArrowDown', moveDown),
    createAction('KeyS', moveDown),
    createAction('Numpad2', moveDown),
] as const;

export const moveVerticallyActions: ReadonlyArray<Action> = [...moveUpActions, ...moveDownActions] as const;
