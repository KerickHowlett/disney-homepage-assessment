import { Singleton } from '@common/decorators';
import { PubSub } from '@common/events';
import { HomeState } from '../types';
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
        this.messenger.publish('HOME_STORE_UPDATED', state);
        this._state = state;
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
}
