import './app';
import './features/home';
import './styles.css';

window.addEventListener('load', (): Promise<void> => registerServiceWorker());

async function registerServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
        try {
            const swFilePath: string = import.meta.env.DISNEY_SW || './src/sw.js';
            await navigator.serviceWorker.register(swFilePath);
        } catch (error) {
            console.error('Service Worker registration failed!');
            console.error(error);
        }
    }
}
