// @NOTE: Not designed to assert changes between whole objects, arrays, maps, sets, etc.
//        Primitive values only.
type Value = string | number | boolean | undefined | null;
export function changeDetectedBetween(oldValue: Value, newValue: Value): boolean {
    return newValue !== oldValue;
}
