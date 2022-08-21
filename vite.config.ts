import { VitePWA } from 'vite-plugin-pwa';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

const TEST_FILES: string[] = ['**/*.spec.ts'];

export default defineConfig({
    build: {
        cssCodeSplit: true,
        outDir: 'dist/disney-homepage-assessment',
        sourcemap: 'hidden',
        target: 'ESNext',
        watch: {
            include: 'src/**/*',
            exclude: TEST_FILES,
        },
    },
    cacheDir: '.cache/vite',
    css: {
        devSourcemap: true,
    },
    envPrefix: 'DISNEY_',
    plugins: [
        tsconfigPaths(),
        VitePWA({
            injectRegister: 'inline',
            registerType: 'autoUpdate',
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
