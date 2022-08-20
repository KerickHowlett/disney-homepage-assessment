import type { Collection } from '../../types';

import { isEmpty } from '@common/utils';
import { CollectionType } from '../../constants';

const collectionFilterCurry = (property: keyof Collection, value: Collection[typeof property]) => {
    return (collection: Collection): boolean => collection[property] === value;
};

const BY_COLLECTION_TYPE = 'type';
export const byPersonalizedCollections = collectionFilterCurry(BY_COLLECTION_TYPE, CollectionType.PERSONALIZED);
export const byStandardCollections = collectionFilterCurry(BY_COLLECTION_TYPE, CollectionType.STANDARD);
export const byHavingContent = ({ content }: Collection): boolean => !isEmpty(content);
