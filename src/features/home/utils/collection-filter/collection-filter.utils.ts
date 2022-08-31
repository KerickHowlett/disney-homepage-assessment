import type { Collection, CollectionSetType } from '../../types';

import { isEmpty } from '@common/utils';

export const CollectionType: Record<'STANDARD' | 'PERSONALIZED', CollectionSetType> = {
    STANDARD: 'CuratedSet',
    PERSONALIZED: 'SetRef',
} as const;

const collectionFilterCurry = (property: keyof Collection, value: Collection[typeof property]) => {
    return (collection: Collection): boolean => collection[property] === value;
};

const BY_COLLECTION_TYPE = 'type';
export const byPersonalizedCollections = collectionFilterCurry(BY_COLLECTION_TYPE, CollectionType.PERSONALIZED);
export const byStandardCollections = collectionFilterCurry(BY_COLLECTION_TYPE, CollectionType.STANDARD);
export const byHavingContent = ({ content }: Collection): boolean => !isEmpty(content);
export const byHavingNoContent = ({ content }: Collection): boolean => isEmpty(content);
