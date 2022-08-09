import type { ImportMetaEnv } from '../../../env';

type ValueOf<T> = T[keyof T];

export function getEnv(key: ValueOf<ImportMetaEnv>): string {
    return import.meta.env[key] || '';
}
