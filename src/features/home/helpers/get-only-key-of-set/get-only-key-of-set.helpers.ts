// @NOTE: Since some datasets only ever one key with these sets, currently,
//        this will do for now, but a more dynamic approach would be ideal.
export function getOnlyKeyOfSet<T extends Record<string, unknown>>(data: T): keyof T {
    return Object.keys(data)[0];
}
