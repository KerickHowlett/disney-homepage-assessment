import { isUndefined } from '../is-undefined';

export function clamp(value: number, _min?: number, _max?: number): number {
    const max: number = isUndefined(_max) ? Number.MAX_SAFE_INTEGER : _max;
    const min: number = isUndefined(_min) ? 0 : _min;
    return Math.min(Math.max(value, min), max);
}
