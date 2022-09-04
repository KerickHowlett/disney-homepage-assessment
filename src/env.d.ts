/// <reference types="vite/client" />

export interface ImportMeta {
    readonly env: ImportMetaEnv;
}

export interface ImportMetaEnv {
    readonly DISNEY_HOME_API_DOMAIN: string;
    readonly DISNEY_CACHE_STATIC_FILES_STORE_NAME: string;
    readonly DISNEY_CACHE_FETCH_RESPONSES_STORE_NAME: string;
    readonly DISNEY_SERVICE_WORKER: string;
}
