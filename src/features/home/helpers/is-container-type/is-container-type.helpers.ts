import { ContainerSet, ContainerSetType } from '@disney/features/home/types';

export function isContainerType(targetType: ContainerSetType, set: Readonly<ContainerSet>): boolean {
    return set.type === targetType;
}
