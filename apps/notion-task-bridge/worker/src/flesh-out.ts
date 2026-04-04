import * as toolkit from "./generated/toolkit-context";
import {
	appendBlocks,
	blockPlainText,
	clearPageContent,
	listAllBlockChildren,
	markdownToParagraphBlocks,
	notionRequest,
} from "./notion-api";

type FleshOutJson = {
	taskTitle?: string;
	status?: string;
	type?: string;
	priority?: string;
	notes?: string;
	bodyMarkdown: string;
};

export async function runFleshOut(env: Env, pageId: string): Promise<void> {
	if (!env.ANTHROPIC_API_KEY) {
		throw new Error("ANTHROPIC_API_KEY missing");
	}
	const page = (await notionRequest(env, `/pages/${pageId}`)) as {
		properties?: Record<string, unknown>;
		url?: string;
	};
	const blocks = await listAllBlockChildren(env, pageId);
	const bodyText = blocks.map(blockPlainText).filter(Boolean).join("\n");
	const propsSummary = JSON.stringify(page.properties ?? {}, null, 0);

	const system = [
		"You are the orbytes project-manager agent performing *Expand thin tasks*.",
		"Output must be a single JSON object (no markdown fences) with keys:",
		`taskTitle (string, optional), status (string, optional, one of the Dev Pipeline statuses such as "Idea Ready"),`,
		`type (optional: Feature | Bug | Chore | Research | Docs), priority (optional: Critical | High | Medium | Low),`,
		`notes (short string for the Notes property), bodyMarkdown (required string, markdown). Put phase in bodyMarkdown if relevant.`,
		"The bodyMarkdown must follow the Task authoring / Agent Instructions shape from the toolkit (Objective, Context, Steps, Acceptance Criteria).",
		"Use property names that will be mapped to Notion: Task (title), Status, Type, Priority, Notes.",
		"\n--- Toolkit reference (read and follow) ---\n",
		toolkit.projectManager.slice(0, 120_000),
		"\n--- pipeline ---\n",
		toolkit.pipeline.slice(0, 40_000),
		"\n--- task command excerpts ---\n",
		toolkit.taskCommand.slice(0, 80_000),
	].join("\n");

	const user = [
		`Notion page id: ${pageId}`,
		`Current properties (JSON): ${propsSummary.slice(0, 25_000)}`,
		`Existing page body text:\n${bodyText.slice(0, 30_000)}`,
		"Rewrite into a full agent-executable brief. Set status to Idea Ready when the brief is complete enough for a developer to execute without guessing.",
	].join("\n\n");

	const raw = await callAnthropic(env, system, user);
	const parsed = parseFleshOutJson(raw);
	await patchNotionPage(env, pageId, parsed);
	await clearPageContent(env, pageId);
	const paraBlocks = markdownToParagraphBlocks(parsed.bodyMarkdown);
	await appendBlocks(env, pageId, paraBlocks);
}

function parseFleshOutJson(text: string): FleshOutJson {
	const t = text.trim();
	const start = t.indexOf("{");
	const end = t.lastIndexOf("}");
	if (start === -1 || end === -1 || end <= start) {
		throw new Error("anthropic_response_not_json");
	}
	const slice = t.slice(start, end + 1);
	const obj = JSON.parse(slice) as FleshOutJson;
	if (!obj.bodyMarkdown || typeof obj.bodyMarkdown !== "string") {
		throw new Error("flesh_out_missing_bodyMarkdown");
	}
	return obj;
}

async function callAnthropic(
	env: Env,
	system: string,
	user: string,
): Promise<string> {
	const r = await fetch("https://api.anthropic.com/v1/messages", {
		method: "POST",
		headers: {
			"x-api-key": env.ANTHROPIC_API_KEY!,
			"anthropic-version": "2023-06-01",
			"content-type": "application/json",
		},
		body: JSON.stringify({
			model: "claude-sonnet-4-20250514",
			max_tokens: 16_384,
			system,
			messages: [{ role: "user", content: user }],
		}),
	});
	const text = await r.text();
	if (!r.ok) {
		throw new Error(`anthropic ${r.status}: ${text}`);
	}
	const data = JSON.parse(text) as {
		content?: Array<{ type: string; text?: string }>;
	};
	const block = data.content?.find((c) => c.type === "text");
	const out = block?.text;
	if (!out) {
		throw new Error("anthropic_empty_content");
	}
	return out;
}

async function patchNotionPage(
	env: Env,
	pageId: string,
	f: FleshOutJson,
): Promise<void> {
	const properties: Record<string, unknown> = {};
	if (f.taskTitle) {
		properties["Task"] = {
			title: [{ type: "text", text: { content: f.taskTitle.slice(0, 2000) } }],
		};
	}
	if (f.status) {
		properties["Status"] = { status: { name: f.status } };
	}
	if (f.type) {
		properties["Type"] = { select: { name: f.type } };
	}
	if (f.priority) {
		properties["Priority"] = { select: { name: f.priority } };
	}
	if (f.notes) {
		properties["Notes"] = { rich_text: richChunks(f.notes, 2000) };
	}
	if (Object.keys(properties).length === 0) {
		return;
	}
	await notionRequest(env, `/pages/${pageId}`, {
		method: "PATCH",
		body: JSON.stringify({ properties }),
	});
}

function richChunks(s: string, max: number): Array<{ type: string; text: { content: string } }> {
	const chunks: Array<{ type: string; text: { content: string } }> = [];
	let i = 0;
	while (i < s.length) {
		chunks.push({
			type: "text",
			text: { content: s.slice(i, i + max) },
		});
		i += max;
	}
	return chunks;
}
