import type { OnAction } from '@common/types';
import type { CollectionSetType, HomeActionTypes } from '../types';

export const CollectionType: Record<'STANDARD' | 'PERSONALIZED', CollectionSetType> = {
    STANDARD: 'CuratedSet',
    PERSONALIZED: 'SetRef',
} as const;

export const OnHomeAction: OnAction<HomeActionTypes> = {
    LOAD_STANDARD_COLLECTIONS: 'LOAD_STANDARD_COLLECTIONS',
    LOAD_PERSONALIZED_COLLECTION: 'LOAD_PERSONALIZED_COLLECTION',
} as const;

export const DISNEY_COLLECTION = 'disney-collection';
export const COLLECTION_ID = 'collection-id';
export const HOME_JSON_API = 'home.json';
export const HOME_STATE_EVENTS = 'HOME_STORE_UPDATED';
export const TARGET_ASPECT_RATIO = '1.78';
