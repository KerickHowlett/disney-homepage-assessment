import type { ContainerItem, Content } from '../../types';
import { pluckContent } from '../pluck-content';

export function getContent(items: ReadonlyArray<ContainerItem>): ReadonlyArray<Content> {
    return (items || []).map<Content>((item: ContainerItem): Content => pluckContent(item));
}
