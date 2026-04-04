CREATE TABLE jobs (
	id TEXT PRIMARY KEY,
	dev_id INTEGER,
	notion_page_id TEXT,
	action TEXT NOT NULL CHECK (action IN ('run', 'flesh_out')),
	status TEXT NOT NULL CHECK (status IN ('pending', 'claimed', 'completed', 'failed')),
	created_at TEXT NOT NULL,
	updated_at TEXT NOT NULL,
	payload TEXT
);

CREATE INDEX idx_jobs_status_created ON jobs (status, created_at);
