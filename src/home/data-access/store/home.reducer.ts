import { Callback, PubSubServices, Singleton } from '@disney/shared';
import type { AllHomeActions, HomeActionPayloads, HomeActionTypes } from './home.actions';
import { HomeActions, OnHomeAction as on } from './home.actions';
import type { HomeState } from './home.state';
import { getInitialHomeStoreState } from './home.state';
import type { RefId } from './types';

export const HOME_STATE_EVENTS = 'HOME_STORE_UPDATED';

@Singleton()
export class HomeReducer {
    constructor(
        private _state: HomeState = getInitialHomeStoreState(),
        private readonly action: HomeActions = new HomeActions(),
        public readonly messenger: PubSubServices = new PubSubServices(),
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
