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
        private readonly actions: HomeControlsActions = new HomeControlsActions(),
        public readonly messenger: PubSub = new PubSub(),
    ) {}

    get state(): Readonly<HomeControlsState> {
        return Object.freeze<HomeControlsState>(this._state);
    }

    @Throttle(250)
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
        if (event.repeat) return state;

        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
            case 'Numpad8':
                return this.actions.moveVertically(this.state, 'UP');
            case 'ArrowRight':
            case 'KeyD':
            case 'Numpad6':
                return this.actions.moveHorizontally(this.state, 'RIGHT');
            case 'ArrowDown':
            case 'KeyS':
            case 'Numpad2':
                return this.actions.moveVertically(this.state, 'DOWN');
            case 'ArrowLeft':
            case 'KeyA':
            case 'Numpad4':
                return this.actions.moveHorizontally(this.state, 'LEFT');
            case 'Shift':
            case 'Tab':
            case 'ControlLeft':
            case 'ControlRight':
                return state;
            default:
                return state;
        }
    }
}
