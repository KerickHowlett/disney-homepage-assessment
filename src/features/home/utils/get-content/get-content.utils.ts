import { isNil } from '@common/utils';
import type { ContainerItem, Content } from '../../types';
import { pluckContent } from '../pluck-content';

export function getContent(items?: ReadonlyArray<ContainerItem>): Content[] {
    if (isNil(items)) return [];
    return items.map<Content>(pluckContent);
}
