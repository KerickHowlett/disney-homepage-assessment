import { Singleton } from '@common/decorators';
import { PubSub } from '@common/events';
import { HOME_STATE_EVENTS, OnHomeAction } from '../../constants';
import type { AllHomeActions, HomeActionPayloads, HomeActionTypes, HomeState } from '../../types';
import { HomeActions } from '../actions';
import { getInitialState } from '../state';

@Singleton()
export class HomeReducer extends PubSub {
    constructor(private _state: HomeState = getInitialState(), private action: HomeActions = new HomeActions()) {
        super();
    }

    get state(): Readonly<HomeState> {
        return Object.freeze<HomeState>(this._state);
    }

    async on(type: HomeActionTypes, payload?: HomeActionPayloads): Promise<void> {
        this._state = await this.dispatch(this._state, { type, payload } as AllHomeActions);
        this.publish(HOME_STATE_EVENTS, this._state);
    }

    private async dispatch(
        state: Readonly<HomeState> = getInitialState(),
        action: Readonly<AllHomeActions>,
    ): Promise<Readonly<HomeState>> {
        const actionType: HomeActionTypes = action.type;
        switch (actionType) {
            case OnHomeAction.FETCH_HOME_API:
                return this.action.fetchHomeAPI(state);
            case OnHomeAction.SAVE_COLLECTIONS:
                return this.action.saveCollections(state, action.payload);
            default:
                console.error(`Action ${actionType} doesn't exist.`);
                return state;
        }
    }
}
