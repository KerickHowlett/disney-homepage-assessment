import { Singleton } from '@common/decorators';
import { PubSub } from '@common/events';
import { HOME_STATE_EVENTS, OnHomeAction as on } from '../../constants';
import type { AllHomeActions, HomeActionPayloads, HomeActionTypes, HomeState, RefId } from '../../types';
import { HomeActions } from '../actions';
import { getInitialState } from '../state';

// @NOTE: This entire state management store needs to be redone completely, so it
//        can be far more scalable.
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
            case on.LOAD_STANDARD_COLLECTIONS:
                return this.action.fetchHomeAPI(state);
            case on.LOAD_PERSONALIZED_COLLECTION:
                return this.action.fetchPersonalizedCuratedSet(state, action.payload as RefId);
            default:
                console.error(`Action ${actionType} doesn't exist.`);
                return state;
        }
    }
}
