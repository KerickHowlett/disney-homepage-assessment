import './app';
import './styles.css';

window.addEventListener('load', async (): Promise<void> => registerServiceWorker());

async function registerServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
        try {
            const swFilePath: string = import.meta.env.DISNEY_SERVICE_WORKER || '/service-worker.ts';
            await navigator.serviceWorker.register(swFilePath);
        } catch (error: unknown) {
            console.error('Service Worker registration failed:', error);
        }
    }
}
