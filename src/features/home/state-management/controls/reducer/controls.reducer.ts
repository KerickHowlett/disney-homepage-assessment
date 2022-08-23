import { Singleton, Throttle } from '@common/decorators';
import { PubSub } from '@common/events';
import type { Callback } from '@common/types';
import { HomeControlsActions } from '../actions';
import type { HomeControlsState } from '../state';
import { getInitialCoordinatesState } from '../state';

export const HOME_NAVIGATION_CONTROLS = 'HOME_NAVIGATION_FIRED';

Singleton();
export class HomeControlsReducer {
    constructor(
        private _state: HomeControlsState = getInitialCoordinatesState(),
        private actions: HomeControlsActions = new HomeControlsActions(),
        public readonly messenger: PubSub = new PubSub(),
    ) {}

    get state(): Readonly<HomeControlsState> {
        return Object.freeze<HomeControlsState>(this._state);
    }

    @Throttle(100)
    onKeydown(event: Readonly<KeyboardEvent>): void {
        this._state = this.dispatch(this._state, event);
        this.messenger.publish(HOME_NAVIGATION_CONTROLS, this._state);
    }

    subscribe(callback: Callback): void {
        this.messenger.subscribe(HOME_NAVIGATION_CONTROLS, callback);
    }

    unsubscribe(callback: Callback): void {
        this.messenger.unsubscribe(HOME_NAVIGATION_CONTROLS, callback);
    }

    private dispatch(state: Readonly<HomeControlsState>, event: Readonly<KeyboardEvent>): Readonly<HomeControlsState> {
        switch (event.key) {
            case 'ArrowUp':
            case 'KeyW':
            case 'Numpad8':
                event.preventDefault();
                return this.actions.moveVertically(this.state, 'UP');
            case 'ArrowRight':
            case 'KeyD':
            case 'Numpad6':
                event.preventDefault();
                return this.actions.moveHorizontally(this.state, 'RIGHT');
            case 'ArrowDown':
            case 'KeyS':
            case 'Numpad2':
                event.preventDefault();
                return this.actions.moveVertically(this.state, 'DOWN');
            case 'ArrowLeft':
            case 'KeyA':
            case 'Numpad4':
                event.preventDefault();
                return this.actions.moveHorizontally(this.state, 'LEFT');
            default:
                return state;
        }
    }
}
