import type { Callback } from '@disney/shared';
import { PubSubServices, Singleton, Throttle } from '@disney/shared';
import { NavigationActions } from './navigation.action';
import { getInitialNavigationState, NavigationState } from './navigation.state';

export const HOME_NAVIGATION_CONTROLS = 'HOME_NAVIGATION_FIRED';

Singleton();
export class NavigationReducer {
    constructor(
        private _state: NavigationState = getInitialNavigationState(),
        private readonly actions: NavigationActions = new NavigationActions(),
        public readonly messenger: PubSubServices = new PubSubServices(),
    ) {}

    get state(): Readonly<NavigationState> {
        return Object.freeze<NavigationState>(this._state);
    }

    @Throttle(250)
    onKeydown(event: Readonly<KeyboardEvent>): void {
        this._state = this.dispatch(this._state, event);
        this.messenger.publish(HOME_NAVIGATION_CONTROLS, this._state);
    }

    selectFirstContentTile(): void {
        this._state = this.actions.selectElement(this._state, this._state.row, this._state.column);
        this.messenger.publish(HOME_NAVIGATION_CONTROLS, this._state);
    }

    subscribe(callback: Callback): void {
        this.messenger.subscribe(HOME_NAVIGATION_CONTROLS, callback);
    }

    unsubscribe(callback: Callback): void {
        this.messenger.unsubscribe(HOME_NAVIGATION_CONTROLS, callback);
    }

    private dispatch(state: Readonly<NavigationState>, event: Readonly<KeyboardEvent>): Readonly<NavigationState> {
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
