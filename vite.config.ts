import { VitePWA } from 'vite-plugin-pwa';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        cssCodeSplit: true,
        outDir: 'dist/disney-homepage-assessment',
        sourcemap: 'hidden',
        target: 'ESNext',
    },
    cacheDir: '.cache',
    css: {
        devSourcemap: true,
    },
    envPrefix: 'DISNEY_',
    plugins: [
        tsconfigPaths(),
        VitePWA({
            injectRegister: 'inline',
            registerType: 'autoUpdate',
            manifestFilename: 'manifest.json',
        }),
    ],
    preview: {
        port: 8080,
    },
    publicDir: 'src/assets',
    server: {
        hmr: true,
        port: 3000,
    },
});
