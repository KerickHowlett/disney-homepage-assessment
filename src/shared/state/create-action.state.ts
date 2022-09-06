export type ActionCallback = (...args: any[]) => any;
export type ActionType = string;
export interface Action {
    type: ActionType;
    callback: ActionCallback;
}
export type Actions = Map<ActionType, ActionCallback>;

export const createAction = (type: ActionType, callback: ActionCallback): Action => ({
    type,
    callback,
});
