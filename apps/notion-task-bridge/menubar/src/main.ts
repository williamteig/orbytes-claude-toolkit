import "./styles.css";

const apiBase =
	import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:9876";
const deviceToken = import.meta.env.VITE_DEVICE_TOKEN ?? "";

const elStatus = document.querySelector<HTMLElement>("#status")!;
const elJobs = document.querySelector<HTMLElement>("#jobs")!;
const btnRefresh = document.querySelector<HTMLButtonElement>("#refresh")!;

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

btnRefresh.addEventListener("click", () => void poll());
void poll();
setInterval(() => void poll(), 30_000);
