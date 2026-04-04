import "./styles.css";

const apiBase =
	import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:9876";
const deviceToken = import.meta.env.VITE_DEVICE_TOKEN ?? "";
const webhookSecret = import.meta.env.VITE_WEBHOOK_SECRET ?? "";

const elStatus = document.querySelector<HTMLElement>("#status")!;
const elJobs = document.querySelector<HTMLElement>("#jobs")!;
const btnRefresh = document.querySelector<HTMLButtonElement>("#refresh")!;
const elFlesh = document.querySelector<HTMLElement>("#fleshOutResult")!;
const inpPage = document.querySelector<HTMLInputElement>("#pageId")!;
const btnFlesh = document.querySelector<HTMLButtonElement>("#fleshOut")!;

async function poll(): Promise<void> {
	elStatus.textContent = "Fetching…";
	try {
		const r = await fetch(`${apiBase}/api/jobs/pending`, {
			headers: {
				Authorization: `Bearer ${deviceToken}`,
			},
		});
		if (!r.ok) {
			elStatus.textContent = `Error ${r.status}`;
			elJobs.textContent = await r.text();
			return;
		}
		const data = (await r.json()) as { jobs: unknown[] };
		elStatus.textContent = `OK — ${data.jobs.length} pending`;
		elJobs.textContent = JSON.stringify(data, null, 2);
	} catch (e) {
		elStatus.textContent = "Network error";
		elJobs.textContent = String(e);
	}
}

async function fleshOut(): Promise<void> {
	elFlesh.textContent = "";
	const raw = inpPage.value.trim();
	if (!raw) {
		elFlesh.textContent = "Enter a page ID or URL.";
		return;
	}
	if (!webhookSecret) {
		elFlesh.textContent =
			"Set VITE_WEBHOOK_SECRET in .env (same value as Worker WEBHOOK_SECRET).";
		return;
	}
	elFlesh.textContent = "Sending…";
	try {
		const r = await fetch(`${apiBase}/api/tasks/flesh-out`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${webhookSecret}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ notionPageId: raw }),
		});
		const text = await r.text();
		elFlesh.textContent = `${r.status}\n${text}`;
	} catch (e) {
		elFlesh.textContent = String(e);
	}
}

btnRefresh.addEventListener("click", () => void poll());
btnFlesh.addEventListener("click", () => void fleshOut());
void poll();
setInterval(() => void poll(), 30_000);
