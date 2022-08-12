import type { OnAction } from '@common/types';
import type { ContainerSetType, HomeActionTypes } from '../types';

export const ContainerType: Record<string, ContainerSetType> = {
    CuratedSet: 'CuratedSet',
    SetRef: 'SetRef',
} as const;

export const DISNEY_HOME_API = 'home.json';
export const DISNEY_HOME_STORE_LABEL = '[DISNEY HOMEPAGE]';

export const OnHomeAction: OnAction<HomeActionTypes> = {
    FETCH_HOME_API: 'FETCH_HOME_API',
    SAVE_COLLECTIONS: 'SAVE_COLLECTIONS',
} as const;

export const TARGET_ASPECT_RATIO = '1.78';
