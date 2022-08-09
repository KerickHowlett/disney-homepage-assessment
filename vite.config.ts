import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

const TEST_FILES: string[] = ['**/*.spec.ts'];

export default defineConfig({
    build: {
        watch: {
            include: 'src/**/*',
            exclude: TEST_FILES,
        },
    },
    css: {
        devSourcemap: true,
    },
    envPrefix: 'DISNEY_',
    plugins: [tsconfigPaths()],
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
