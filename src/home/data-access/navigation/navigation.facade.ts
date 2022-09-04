import type { ContentTileComponent } from '@disney/home/features/content-tile';
import type { Callback } from '@disney/shared';
import { isUndefined, Singleton } from '@disney/shared';
import type { ContentStateKey } from '../store';
import { NavigationReducer } from './navigation.reducer';
import { NavigationState } from './navigation.state';
import { getNthContentTileFromNthCollection, getVirtualScrollRootOfCollectionsList } from './utils';

@Singleton()
export class NavigationFacade {
    private observer: MutationObserver = new MutationObserver(this.selectFirstContentTileOnViewInit.bind(this));
    constructor(private readonly reducer: NavigationReducer = new NavigationReducer()) {}

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
            this.reducer.onKeydown(event);
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
            this.reducer.onKeydown(event);
        });
    }

    private bindObserver(): void {
        const collectionsList: Element = getVirtualScrollRootOfCollectionsList()!.host;
        this.observer.observe(collectionsList, { childList: true, subtree: true });
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
        this.reducer.selectFirstContentTile();
        this.observer.disconnect();
    }
}
