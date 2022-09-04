export function getContrastBetween<T = unknown>(a: T[], b: T[]): T[] {
    return a.filter((item: T): boolean => !b.includes(item));
}
