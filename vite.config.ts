import { defineConfig } from 'vitest/config';

export default defineConfig({
    build: {
        watch: {
            include: 'src/**/*',
            exclude: ['**/node_modules/**', '**/*.spec.ts'],
        },
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
        include: ['**/*.spec.ts'],
        globals: true,
        reporters: 'default',
        root: 'src',
        // setupFiles: [''],
    },
});
