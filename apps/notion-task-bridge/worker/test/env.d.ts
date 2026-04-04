declare module 'cloudflare:test' {
	// Augments cloudflare:test; Env is defined in worker-configuration.d.ts
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	interface ProvidedEnv extends Env {}
}
