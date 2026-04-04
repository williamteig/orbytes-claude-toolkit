const NOTION_VERSION = '2022-06-28';
const NOTION_BASE = 'https://api.notion.com/v1';

export async function notionRequest(env: Env, path: string, init?: RequestInit): Promise<unknown> {
	const key = env.NOTION_API_KEY;
	if (!key) {
		throw new Error('NOTION_API_KEY missing');
	}
	const r = await fetch(`${NOTION_BASE}${path}`, {
		...init,
		headers: {
			Authorization: `Bearer ${key}`,
			'Notion-Version': NOTION_VERSION,
			'Content-Type': 'application/json',
			...(init?.headers ?? {}),
		},
	});
	const text = await r.text();
	if (!r.ok) {
		throw new Error(`notion ${r.status}: ${text}`);
	}
	return text ? (JSON.parse(text) as unknown) : null;
}

type NotionBlock = {
	id: string;
	type: string;
	has_children?: boolean;
	paragraph?: { rich_text?: Array<{ plain_text?: string }> };
	bulleted_list_item?: { rich_text?: Array<{ plain_text?: string }> };
	numbered_list_item?: { rich_text?: Array<{ plain_text?: string }> };
	heading_1?: { rich_text?: Array<{ plain_text?: string }> };
	heading_2?: { rich_text?: Array<{ plain_text?: string }> };
	heading_3?: { rich_text?: Array<{ plain_text?: string }> };
	to_do?: { rich_text?: Array<{ plain_text?: string }> };
	quote?: { rich_text?: Array<{ plain_text?: string }> };
	callout?: { rich_text?: Array<{ plain_text?: string }> };
	code?: { rich_text?: Array<{ plain_text?: string }> };
};

function plainFromRich(rich: Array<{ plain_text?: string }> | undefined): string {
	if (!rich?.length) return '';
	return rich.map((t) => t.plain_text ?? '').join('');
}

export function blockPlainText(block: NotionBlock): string {
	const t = block.type;
	if (t === 'paragraph') return plainFromRich(block.paragraph?.rich_text);
	if (t === 'bulleted_list_item') return plainFromRich(block.bulleted_list_item?.rich_text);
	if (t === 'numbered_list_item') return plainFromRich(block.numbered_list_item?.rich_text);
	if (t === 'heading_1') return plainFromRich(block.heading_1?.rich_text);
	if (t === 'heading_2') return plainFromRich(block.heading_2?.rich_text);
	if (t === 'heading_3') return plainFromRich(block.heading_3?.rich_text);
	if (t === 'to_do') return plainFromRich(block.to_do?.rich_text);
	if (t === 'quote') return plainFromRich(block.quote?.rich_text);
	if (t === 'callout') return plainFromRich(block.callout?.rich_text);
	if (t === 'code') return plainFromRich(block.code?.rich_text);
	return '';
}

export async function listAllBlockChildren(env: Env, blockId: string): Promise<NotionBlock[]> {
	const out: NotionBlock[] = [];
	let cursor: string | undefined;
	for (;;) {
		const q = cursor
			? `/blocks/${blockId}/children?start_cursor=${encodeURIComponent(cursor)}&page_size=100`
			: `/blocks/${blockId}/children?page_size=100`;
		const page = (await notionRequest(env, q)) as {
			results?: NotionBlock[];
			has_more?: boolean;
			next_cursor?: string | null;
		};
		out.push(...(page.results ?? []));
		if (!page.has_more || !page.next_cursor) break;
		cursor = page.next_cursor ?? undefined;
	}
	return out;
}

export async function deleteBlock(env: Env, blockId: string): Promise<void> {
	await notionRequest(env, `/blocks/${blockId}`, { method: 'DELETE' });
}

export async function clearPageContent(env: Env, pageId: string): Promise<void> {
	const top = (await notionRequest(env, `/blocks/${pageId}/children?page_size=100`)) as {
		results?: NotionBlock[];
		has_more?: boolean;
		next_cursor?: string | null;
	};
	let results = top.results ?? [];
	let hasMore = top.has_more;
	let next = top.next_cursor;
	while (hasMore && next) {
		const page = (await notionRequest(env, `/blocks/${pageId}/children?start_cursor=${encodeURIComponent(next)}&page_size=100`)) as {
			results?: NotionBlock[];
			has_more?: boolean;
			next_cursor?: string | null;
		};
		results = results.concat(page.results ?? []);
		hasMore = !!page.has_more;
		next = page.next_cursor ?? null;
	}
	for (const b of results) {
		await deleteBlock(env, b.id);
	}
}

export function markdownToParagraphBlocks(markdown: string): unknown[] {
	const chunks = chunkByMaxLength(markdown.trim(), 1800);
	return chunks.map((chunk) => ({
		object: 'block',
		type: 'paragraph',
		paragraph: {
			rich_text: [
				{
					type: 'text',
					text: { content: chunk },
				},
			],
		},
	}));
}

function chunkByMaxLength(s: string, max: number): string[] {
	if (s.length <= max) return [s];
	const parts: string[] = [];
	let i = 0;
	while (i < s.length) {
		parts.push(s.slice(i, i + max));
		i += max;
	}
	return parts;
}

export async function appendBlocks(env: Env, parentId: string, children: unknown[]): Promise<void> {
	const batchSize = 100;
	for (let i = 0; i < children.length; i += batchSize) {
		const slice = children.slice(i, i + batchSize);
		await notionRequest(env, `/blocks/${parentId}/children`, {
			method: 'PATCH',
			body: JSON.stringify({ children: slice }),
		});
	}
}
