import { createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src/index';

const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe('notion-task-bridge-api', () => {
	it('GET /health returns service json (unit style)', async () => {
		const request = new IncomingRequest('http://example.com/health');
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, getEnv(), ctx);
		await waitOnExecutionContext(ctx);
		const body = JSON.parse(await response.text()) as { ok: boolean; service: string };
		expect(body.ok).toBe(true);
		expect(body.service).toBe('notion-task-bridge-api');
	});

	it('GET /health (integration style)', async () => {
		const response = await SELF.fetch('https://example.com/health');
		const body = JSON.parse(await response.text()) as { ok: boolean };
		expect(body.ok).toBe(true);
	});
});

function getEnv(): Env {
	return {
		DB: undefined as unknown as D1Database,
		WEBHOOK_SECRET: 'test',
		DEVICE_TOKEN: 'test',
	};
}
