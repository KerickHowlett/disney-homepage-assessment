import type { ContainerItem, Content, ContentState, ContentStateKey } from '../../types';
import { pluckContent } from '../pluck-content';

export function getContentState(items: ReadonlyArray<ContainerItem>): ContentState {
    const contentState: Map<ContentStateKey, Content> = new Map();
    for (const item of items || []) {
        const content: Content = pluckContent(item);
        contentState.set(content.id, content);
    }
    return contentState;
}
