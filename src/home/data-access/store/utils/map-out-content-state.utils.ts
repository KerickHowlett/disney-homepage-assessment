import { isUndefined } from '@disney/shared';
import type { Content, ContentState, MutableContent } from '../home.state';

export function mapOutContentState(contentSet: Content[], contentState?: MutableContent): ContentState {
    const outputMap: MutableContent = isUndefined(contentState) ? new Map() : structuredClone(contentState);
    for (const content of new Set(contentSet)) {
        outputMap.set(content.id, content);
    }
    return outputMap;
}
