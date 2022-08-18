// import { VitePWA } from 'vite-plugin-pwa';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

const TEST_FILES: string[] = ['**/*.spec.ts'];

export default defineConfig({
    build: {
        outDir: 'dist/disney-homepage-assessment',
        sourcemap: 'hidden',
        watch: {
            include: 'src/**/*',
            exclude: TEST_FILES,
        },
    },
    css: {
        devSourcemap: true,
    },
    envPrefix: 'DISNEY_',
    plugins: [
        tsconfigPaths(),
        // VitePWA({
        //     includeAssets: [
        //         'https://prod-ripcut-delivery.disney-plus.net/v1/variant/disney/73FE8AEF93AE19518421FDA85EE671B6EECE6C8DD02B1E7434D3DE719E97E72B/scale?format=jpeg&quality=90&scalingAlgorithm=lanczos3&width=500',
        //         'https://static-assets.bamgrid.com/fonts/avenir-world-for-disney/AvenirWorldforDisneyv2-Demi.c737f3bb45822159626cd7952dc1636e.woff2',
        //         'https://static-assets.bamgrid.com/fonts/avenir-world-for-disney/AvenirWorldforDisneyv2.d63aa1080e072dcb10992153d5ebd496.woff2',
        //         'index.html',
        //         'src',
        //         'src/favicon.ico',
        //         'src/main.ts',
        //         'src/styles.css',
        //     ],
        //     injectRegister: 'inline',
        //     registerType: 'autoUpdate',
        // }),
    ],
    preview: {
        port: 8080,
    },
    server: {
        port: 3000,
    },
    test: {
        cache: { dir: '.cache/vitest' },
        restoreMocks: true,
        coverage: {
            reporter: ['text', 'json', 'html'],
        },
        environment: 'jsdom',
        include: TEST_FILES,
        globals: true,
        reporters: 'default',
        root: 'src',
    },
});
