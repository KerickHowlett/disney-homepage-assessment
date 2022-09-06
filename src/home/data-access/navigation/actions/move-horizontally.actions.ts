import type { Action } from '@disney/shared';
import { clamp, createAction } from '@disney/shared';
import type { NavigationState } from '../state';
import { selectElement } from './select-element.actions';
import { countContentTilesInCurrentCollection } from './utils';

export type HorizontalDirection = 'LEFT' | 'RIGHT';

function moveHorizontally(state: NavigationState, moveToColumn: number): Readonly<NavigationState> {
    const totalTiles: number = countContentTilesInCurrentCollection(state.row);
    const targetColumn: number = clamp(moveToColumn, 1, totalTiles);
    return selectElement(state, state.row, targetColumn);
}

function moveLeft(state: NavigationState): Readonly<NavigationState> {
    const leftColumn: number = state.column - 1;
    return moveHorizontally(state, leftColumn);
}

function moveRight(state: NavigationState): Readonly<NavigationState> {
    const rightColumn: number = state.column + 1;
    return moveHorizontally(state, rightColumn);
}

export const moveLeftActions: ReadonlyArray<Action> = [
    createAction('ArrowLeft', moveLeft),
    createAction('KeyA', moveLeft),
    createAction('Numpad4', moveLeft),
] as const;
export const moveRightActions: ReadonlyArray<Action> = [
    createAction('ArrowRight', moveRight),
    createAction('KeyD', moveRight),
    createAction('Numpad6', moveRight),
] as const;

export const moveHorizontallyActions: ReadonlyArray<Action> = [...moveLeftActions, ...moveRightActions] as const;
