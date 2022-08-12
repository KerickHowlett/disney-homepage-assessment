import { Singleton } from '@common/decorators';
import { OnHomeAction } from '../../constants';
import type { AllHomeActions, HomeActionTypes, HomeState } from '../../types';
import { HomeActions } from '../actions';
import { initialState } from '../state';

@Singleton()
export class HomeReducer {
    constructor(private readonly action: HomeActions = new HomeActions()) {}

    async dispatch(
        state: Readonly<HomeState> = initialState,
        action: Readonly<AllHomeActions>,
    ): Promise<Readonly<HomeState>> {
        const actionType: HomeActionTypes = action.type;
        switch (actionType) {
            case OnHomeAction.FETCH_HOME_API:
                return this.action.fetchHomeAPI(state);
            case OnHomeAction.SAVE_COLLECTIONS:
                return this.action.saveCollections(state, action.payload);
            default:
                console.error("Action doesn't exist", actionType);
                return state;
        }
    }
}
