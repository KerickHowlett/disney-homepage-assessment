import { isNil } from '@common/utils';
import type { ContainerItem, Content, ContentStateKey } from '../../types';
import { pluckContent } from '../pluck-content';

export function getContentAndIds(items?: ReadonlyArray<ContainerItem>): [Content[], ContentStateKey[]] {
    if (isNil(items)) return [[], []];

    const contentIds: ContentStateKey[] = [];
    const content: Content[] = items.map<Content>((item: ContainerItem): Content => {
        const pluckedContent: Content = pluckContent(item);
        contentIds.push(pluckedContent.id);
        return pluckedContent;
    });
    return [content, contentIds];
}
