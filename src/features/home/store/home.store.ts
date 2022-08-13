import { Singleton } from '@common/decorators';
import { PubSub } from '@common/events';
import type { Callback } from '@common/types';
import { MESSENGER_EVENTS_KEY } from '../constants';
import { CollectionStateKey, HomeState } from '../types';
import { HomeReducer } from './reducer/home.reducer';
import { initialState } from './state/home.state';

@Singleton()
export class HomeStore {
    constructor(
        private _state: HomeState = initialState,
        private messenger: PubSub = new PubSub(),
        private readonly reducer: HomeReducer = new HomeReducer(),
    ) {
        this.messenger.publish('HOME_STORE_INITIALIZED', this._state);
    }

    get state(): Readonly<HomeState> {
        return this._state;
    }

    private set state(state: Readonly<HomeState>) {
        this.messenger.publish(MESSENGER_EVENTS_KEY, state);
        this._state = state;
    }

    getCollectionIds(): ReadonlyArray<CollectionStateKey> {
        return Array.from(this.state.collections.keys());
    }

    async onInit(): Promise<void> {
        this.state = await this.reducer.dispatch(this._state, {
            type: 'FETCH_HOME_API',
            payload: null,
        });
        this.state = await this.reducer.dispatch(this._state, {
            type: 'FETCH_HOME_API',
            payload: null,
        });
    }

    subscribe(callback: Callback) {
        return this.messenger.subscribe(MESSENGER_EVENTS_KEY, callback);
    }
}
