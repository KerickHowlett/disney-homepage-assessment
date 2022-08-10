import './app';
import './features/home';
import './styles.css';

window.addEventListener('load', (): Promise<void> => registerServiceWorker());

async function registerServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register('./sw.js');
        } catch (error) {
            console.error('Service Worker registration failed!');
            console.error(error);
        }
    }
}
