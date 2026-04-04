/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_API_BASE_URL: string;
	readonly VITE_DEVICE_TOKEN: string;
	readonly VITE_WEBHOOK_SECRET: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
