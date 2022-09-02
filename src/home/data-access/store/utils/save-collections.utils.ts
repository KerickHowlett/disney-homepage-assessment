import type { Content, ContentState, HomeState, MutableCollections } from '../home.state';
import type { HomeAPIResponse } from '../types';
import { getCollectionAndItsContent } from './get-collection-and-its-content.utils';
import { getContainers } from './get-containers.utils';
import { mapOutContentState } from './map-out-content-state.utils';

export function saveCollections(response: HomeAPIResponse): Readonly<HomeState> {
    const collections: MutableCollections = new Map();
    const contentPlaceholder: Content[] = [];

    for (const { set } of getContainers(response)) {
        const [collection, pluckedContent] = getCollectionAndItsContent(set);
        contentPlaceholder.push(...pluckedContent);
        collections.set(collection.id, collection);
    }

    const content: ContentState = mapOutContentState(contentPlaceholder);
    return Object.freeze({ collections, content });
}
