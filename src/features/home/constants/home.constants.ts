import type { OnAction } from '@common/types';
import type { ContainerSetType, HomeActionTypes } from '../types';

export const ContainerType: Record<string, ContainerSetType> = {
    CuratedSet: 'CuratedSet',
    SetRef: 'SetRef',
} as const;

export const OnHomeAction: OnAction<HomeActionTypes> = {
    FETCH_HOME_API: 'FETCH_HOME_API',
    SAVE_COLLECTIONS: 'SAVE_COLLECTIONS',
} as const;

export const HOME_JSON_API = 'home.json';
export const MESSENGER_EVENTS_KEY = 'HOME_STORE_UPDATED';
export const TARGET_ASPECT_RATIO = '1.78';
