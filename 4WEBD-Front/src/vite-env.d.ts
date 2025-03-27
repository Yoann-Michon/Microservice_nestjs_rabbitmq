/// <reference types="vite/client" />

interface ImportMetaEnv {
    VITE_BACK_API_URL: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }