import { Singleton } from '@common/decorators';
import { PubSub } from '@common/events';
import type { Callback } from '@common/types';
import type { HomeState, RefId } from '../../../types';
import { AllHomeActions, HomeActionPayloads, HomeActions, HomeActionTypes, OnHomeAction as on } from '../actions';
import { getInitialHomeStoreState } from '../state';

export const HOME_STATE_EVENTS = 'HOME_STORE_UPDATED';

@Singleton()
export class HomeReducer {
    constructor(
        private _state: HomeState = getInitialHomeStoreState(),
        private readonly action: HomeActions = new HomeActions(),
        public readonly messenger: PubSub = new PubSub(),
    ) {}

    get state(): Readonly<HomeState> {
        return Object.freeze<HomeState>(this._state);
    }

    async on(type: HomeActionTypes, payload?: HomeActionPayloads): Promise<void> {
        this._state = await this.dispatch(this._state, { type, payload } as AllHomeActions);
        this.messenger.publish(HOME_STATE_EVENTS, this._state);
    }

    subscribe(callback: Callback): void {
        this.messenger.subscribe(HOME_STATE_EVENTS, callback);
    }

    unsubscribe(callback: Callback): void {
        this.messenger.unsubscribe(HOME_STATE_EVENTS, callback);
    }

    private async dispatch(state: Readonly<HomeState>, action: Readonly<AllHomeActions>): Promise<Readonly<HomeState>> {
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
