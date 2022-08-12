/// <reference types="vite/client" />

export interface ImportMetaEnv {
    readonly DISNEY_HOME_API_DOMAIN: string;
    readonly DISNEY_CACHE: string;
}

export interface ImportMeta {
    readonly env: ImportMetaEnv;
}
