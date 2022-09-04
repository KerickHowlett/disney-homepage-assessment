export type ActionCallback<T> = (state: T, ...payload: unknown[]) => Partial<T>;
export type ActionType = string;
export interface Action<T> {
    type: ActionType;
    callback: ActionCallback<T>;
}
export type Actions<T> = Map<ActionType, ActionCallback<T>>;

export const createAction = <T = unknown>(type: ActionType, callback: ActionCallback<T>): Action<T> => ({
    type,
    callback,
});
