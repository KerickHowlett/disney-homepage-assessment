export function isPrimitiveValue(value: unknown): value is null | undefined | string | number | boolean {
    return (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean' ||
        typeof value === 'symbol' ||
        value === null ||
        value === undefined
    );
}
