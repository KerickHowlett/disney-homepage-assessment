import type { ImportMetaEnv } from '@disney/env';
import type { ValueOf } from '@disney/shared/types';

export function getEnv(key: ValueOf<ImportMetaEnv>): string {
    return import.meta.env[key] || '';
}
