import { Content, ContentState, ContentStateKey, MutableContent } from '../../types';

export function mapOutContentState(
    contentSet: Content[],
    contentState: MutableContent = new Map<ContentStateKey, Content>(),
): ContentState {
    for (const content of new Set(contentSet)) {
        if (contentState.has(content.id)) continue;
        contentState.set(content.id, content);
    }
    return contentState;
}
