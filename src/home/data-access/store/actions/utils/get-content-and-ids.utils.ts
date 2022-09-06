import { isNil } from '@disney/shared';
import type { ContainerItem, Content, ContentStateKey } from '../../state';
import { pluckContent } from './pluck-content.utils';

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
