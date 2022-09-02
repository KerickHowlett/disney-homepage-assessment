/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Action<A extends string, P = never> {
    type: A;
    payload: P | null;
}
export type OnAction<A extends string> = Record<A, A>;
export type State<V = any> = Record<string | number, V>;
