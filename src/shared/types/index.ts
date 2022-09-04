/* eslint-disable @typescript-eslint/no-explicit-any */
export type Callback<T = any> = (...args: any[]) => T;
export type ValueOf<T> = T[keyof T];
