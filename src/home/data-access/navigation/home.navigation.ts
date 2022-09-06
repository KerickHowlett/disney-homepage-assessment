import type { ContentTileComponent } from '@disney/home/features/content-tile';
import type { Callback, StateReducer } from '@disney/shared';
import { createReducer, isUndefined, Singleton, Throttle } from '@disney/shared';
import type { ContentStateKey } from '../store';
import { moveHorizontallyActions } from './actions/move-horizontally.actions';
import { moveVerticallyActions } from './actions/move-vertically.actions';
import { selectElementAction, SELECT_ELEMENT } from './actions/select-element.actions';
import { getNthContentTileFromNthCollection, getVirtualScrollRootOfCollectionsList } from './actions/utils';
import { getInitialNavigationState, NavigationState } from './state';

const DEFAULT_COLUMN = 1;
const DEFAULT_ROW = 1;
const HOME_NAVIGATION_CONTROLS = 'HOME NAVIGATION FIRED';

@Singleton()
export class HomeNavigation {
    private readonly reducer: StateReducer<NavigationState>;
    private observer: MutationObserver = new MutationObserver(this.selectFirstContentTileOnViewInit.bind(this));

    constructor() {
        this.reducer = createReducer<NavigationState>(
            HOME_NAVIGATION_CONTROLS,
            getInitialNavigationState(),
            selectElementAction,
            ...moveVerticallyActions,
            ...moveHorizontallyActions,
        );
    }

    get selectedContentId(): ContentStateKey | null {
        return this.state.selectedContentId;
    }

    get state(): Readonly<NavigationState> {
        return this.reducer.state;
    }

    destroy(): void {
        document.removeEventListener('mousedown', (e: MouseEvent) => e.preventDefault());
        document.removeEventListener('mouseup', (e: MouseEvent) => e.preventDefault());
        document.removeEventListener('mousemove', (e: MouseEvent) => e.preventDefault());
        document.removeEventListener('click', (e: MouseEvent) => e.preventDefault());
        document.removeEventListener('dblclick', (e: MouseEvent) => e.preventDefault());
        // document.removeEventListener('contextmenu', (e: MouseEvent) => e.preventDefault());
        document.addEventListener('keydown', (event: KeyboardEvent): void => {
            this.onKeydown(event);
        });
    }

    init(): void {
        this.stubAllMouseEvents();
        this.bindKeyboardEvents();
        this.bindObserver();
    }

    subscribe(callback: Callback): void {
        this.reducer.subscribe(callback);
    }

    unsubscribe(callback: Callback): void {
        this.reducer.unsubscribe(callback);
    }

    private bindKeyboardEvents(): void {
        document.addEventListener('keydown', (event: KeyboardEvent): void => {
            this.onKeydown(event);
        });
    }

    private bindObserver(): void {
        const { host: collectionsList } = getVirtualScrollRootOfCollectionsList()!;
        this.observer.observe(collectionsList, { childList: true, subtree: true });
    }

    @Throttle(250)
    private onKeydown(event: KeyboardEvent): void {
        if (event.repeat) return;
        this.reducer.dispatch(event.code, this.reducer.state);
    }

    private stubAllMouseEvents(): void {
        document.addEventListener('mousedown', (e: MouseEvent) => e.preventDefault());
        document.addEventListener('mouseup', (e: MouseEvent) => e.preventDefault());
        document.addEventListener('mousemove', (e: MouseEvent) => e.preventDefault());
        document.addEventListener('click', (e: MouseEvent) => e.preventDefault());
        document.addEventListener('dblclick', (e: MouseEvent) => e.preventDefault());
        // document.addEventListener('contextmenu', (e: MouseEvent) => e.preventDefault());
    }

    private selectFirstContentTileOnViewInit(): void {
        const firstContentTile: ContentTileComponent | undefined = getNthContentTileFromNthCollection(0, 0);
        if (isUndefined(firstContentTile)) return;

        this.reducer.dispatch(SELECT_ELEMENT, this.reducer.state, DEFAULT_COLUMN, DEFAULT_ROW);
        this.observer.disconnect();
    }
}
