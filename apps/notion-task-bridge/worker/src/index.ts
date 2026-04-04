
type JobAction = 'run' | 'flesh_out';
type JobStatus = 'pending' | 'claimed' | 'completed' | 'failed';

function json(data: unknown, status = 200): Response {
	return new Response(JSON.stringify(data), {
		status,
		headers: {
			'content-type': 'application/json; charset=utf-8',
			'access-control-allow-origin': '*',
			'access-control-allow-methods': 'GET, POST, PATCH, OPTIONS',
			'access-control-allow-headers': 'Authorization, Content-Type',
		},
	});
}

function corsPreflight(): Response {
	return new Response(null, {
		status: 204,
		headers: {
			'access-control-allow-origin': '*',
			'access-control-allow-methods': 'GET, POST, PATCH, OPTIONS',
			'access-control-allow-headers': 'Authorization, Content-Type',
			'access-control-max-age': '86400',
		},
	});
}

function timingSafeEqual(a: string, b: string): boolean {
	if (a.length !== b.length) return false;
	let out = 0;
	for (let i = 0; i < a.length; i++) {
		out |= a.charCodeAt(i) ^ b.charCodeAt(i);
	}
	return out === 0;
}

function bearer(request: Request): string | null {
	const h = request.headers.get('Authorization');
	if (!h?.startsWith('Bearer ')) return null;
	return h.slice(7);
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		if (request.method === 'OPTIONS') {
			return corsPreflight();
		}

		const url = new URL(request.url);
		const path = url.pathname;

		if (path === '/health' || path === '/') {
			return json({ ok: true, service: 'notion-task-bridge-api' });
		}

		if (path === '/api/webhooks/notion' && request.method === 'POST') {
			return handleNotionWebhook(request, env);
		}

		if (path === '/api/jobs/pending' && request.method === 'GET') {
			return listPendingJobs(request, env);
		}

		if (path.startsWith('/api/jobs/') && request.method === 'PATCH') {
			const id = path.slice('/api/jobs/'.length);
			return patchJob(request, env, id);
		}

		return json({ error: 'not_found' }, 404);
	},
} satisfies ExportedHandler<Env>;

async function handleNotionWebhook(request: Request, env: Env): Promise<Response> {
	const secret = env.WEBHOOK_SECRET;
	if (!secret) {
		return json({ error: 'server_misconfigured', detail: 'WEBHOOK_SECRET' }, 500);
	}

	const token = bearer(request);
	if (!token || !timingSafeEqual(token, secret)) {
		return json({ error: 'unauthorized' }, 401);
	}

	let body: {
		action?: JobAction;
		devId?: number;
		notionPageId?: string;
		payload?: Record<string, unknown>;
	};
	try {
		body = (await request.json()) as typeof body;
	} catch {
		return json({ error: 'invalid_json' }, 400);
	}

	const action = body.action;
	if (action !== 'run' && action !== 'flesh_out') {
		return json({ error: 'invalid_action', expected: ['run', 'flesh_out'] }, 400);
	}

	const id = crypto.randomUUID();
	const now = new Date().toISOString();
	const devId =
		typeof body.devId === 'number' && Number.isFinite(body.devId)
			? Math.floor(body.devId)
			: null;
	const notionPageId =
		typeof body.notionPageId === 'string' ? body.notionPageId : null;
	const payload = body.payload ? JSON.stringify(body.payload) : null;

	await env.DB.prepare(
		`INSERT INTO jobs (id, dev_id, notion_page_id, action, status, created_at, updated_at, payload)
     VALUES (?, ?, ?, ?, 'pending', ?, ?, ?)`,
	)
		.bind(id, devId, notionPageId, action, now, now, payload)
		.run();

	return json({ ok: true, jobId: id, action, devId, notionPageId });
}

async function listPendingJobs(request: Request, env: Env): Promise<Response> {
	const device = env.DEVICE_TOKEN;
	if (!device) {
		return json({ error: 'server_misconfigured', detail: 'DEVICE_TOKEN' }, 500);
	}
	const token = bearer(request);
	if (!token || !timingSafeEqual(token, device)) {
		return json({ error: 'unauthorized' }, 401);
	}

	const rs = await env.DB.prepare(
		`SELECT id, dev_id, notion_page_id, action, status, created_at, updated_at, payload
     FROM jobs WHERE status = 'pending' ORDER BY created_at ASC LIMIT 50`,
	).all<{
		id: string;
		dev_id: number | null;
		notion_page_id: string | null;
		action: JobAction;
		status: JobStatus;
		created_at: string;
		updated_at: string;
		payload: string | null;
	}>();

	const jobs = (rs.results ?? []).map((row) => ({
		id: row.id,
		devId: row.dev_id,
		notionPageId: row.notion_page_id,
		action: row.action,
		status: row.status,
		createdAt: row.created_at,
		updatedAt: row.updated_at,
		payload: row.payload ? safeJsonParse(row.payload) : null,
	}));

	return json({ jobs });
}

function safeJsonParse(s: string): unknown {
	try {
		return JSON.parse(s) as unknown;
	} catch {
		return null;
	}
}

async function patchJob(request: Request, env: Env, id: string): Promise<Response> {
	const device = env.DEVICE_TOKEN;
	if (!device) {
		return json({ error: 'server_misconfigured', detail: 'DEVICE_TOKEN' }, 500);
	}
	const token = bearer(request);
	if (!token || !timingSafeEqual(token, device)) {
		return json({ error: 'unauthorized' }, 401);
	}

	let body: { status?: JobStatus };
	try {
		body = (await request.json()) as typeof body;
	} catch {
		return json({ error: 'invalid_json' }, 400);
	}

	const next = body.status;
	if (next !== 'completed' && next !== 'failed' && next !== 'claimed') {
		return json({ error: 'invalid_status' }, 400);
	}

	const now = new Date().toISOString();
	const result = await env.DB.prepare(
		`UPDATE jobs SET status = ?, updated_at = ? WHERE id = ? AND status IN ('pending', 'claimed')`,
	)
		.bind(next, now, id)
		.run();

	if (result.meta.changes === 0) {
		return json({ error: 'not_found_or_invalid_transition' }, 404);
	}

	return json({ ok: true, id, status: next });
}
