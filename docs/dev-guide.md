# PyNote Modular Architecture — Developer Playbook

**Scope:** Practical, code-oriented guidance for building and extending the modular PyNote desktop app (PySide6 + QWebEngine) with Google (Gmail/Calendar/Drive) and other providers. This document complements the scaffold you have and aims to make feature work predictable, testable, and safe.

---

## 1) High-Level Architecture

**Layers**

* **UI** (`app/ui/...`): Panels and columns (Mission Control layout) that render data and host user interactions.
* **Providers** (`app/providers/...`): Service adapters (Google, Slack, Discord, Reddit, etc.). Pure Python; no Qt UI code.
* **Util** (`app/util/...`): Shared infrastructure (threading helpers, caching, logging).
* **App** (`app/main.py`, `app/config.py`): Application bootstrap, window layout, refresh cycles, configuration loading.

**Principles**

* **Modularity first:** One provider per file; one panel per feature. Favor composition over inheritance in UI.
* **Separation of concerns:** Providers return **plain data objects** (DTOs). Panels decide how to display.
* **Thread-safe UI:** All network I/O off the GUI thread; use signals to deliver results back.
* **Config-driven:** Avoid literals in code (IDs, labels, timezones). Read from `pynote.yaml` / `.env`.
* **Graceful failure:** Every provider must fail closed (return empty lists/markers), not crash the app.

---

## 2) Directory Layout (Current Implementation)

```
pynote/
├─ app/
│  ├─ main.py                 # Boot, window, refresh timers (5min interval)
│  ├─ config.py               # YAML + env loader
│  ├─ ui/
│  │  ├─ columns.py           # Left/Center/Right assembly
│  │  ├─ panels_action.py     # Gmail, Calendar, Timeline
│  │  ├─ panels_content.py    # Community feeds, YouTube player
│  │  ├─ panels_context.py    # Cloud tree + Markdown viewer
│  ├─ providers/
│  │  ├─ google.py            # Gmail/Calendar/Drive OAuth adapters
│  │  └─ mocks.py             # Offline/dev substitutes
│  └─ util/
│     └─ threads.py           # Worker/Signal helpers
├─ credentials.json           # Google desktop OAuth client (local only)
├─ token.json                 # Google OAuth tokens (created at runtime)
├─ pynote.yaml                # Non-secret app config (labels, feeds, tz)
├─ pyproject.toml             # Poetry project configuration
├─ requirements.txt            # Python dependencies
└─ README.md
```

---

## 3) Configuration & Secrets

**YAML (`pynote.yaml`)** — user preferences & non-secrets

```yaml
ui:
  timezone: Asia/Seoul
  gmail_labels: ["IMPORTANT", "UNREAD"]
  gcal_calendar_id: primary
  dcinside_gallery: baseball_new
  rss_urls:
    - https://news.google.com/rss?hl=ko&gl=KR&ceid=KR:ko
  youtube_seed_videos: ["dQw4w9WgXcQ"]
```

**ENV (`.env`)** — secrets & tokens (never commit)

```
SLACK_BOT_TOKEN=...
DISCORD_BOT_TOKEN=...
REDDIT_CLIENT_ID=...
REDDIT_SECRET=...
YOUTUBE_API_KEY=...
GITHUB_TOKEN=...
TISTORY_TOKEN=...
```

**Google OAuth**

* `credentials.json` (desktop app) placed in project root.
* `token.json` generated at first run. If scopes change, delete it to re-consent.

**Tip:** Wrap settings access with small helpers (e.g., `get_tz()`, `get_rss_urls()`) so panels don't parse dicts directly.

---

## 4) Data Contracts (DTOs)

Keep provider outputs consistent and typed. Current implementation:

```python
# Gmail items
{
    "from": str,           # Sender email
    "subject": str,         # Email subject
    "snippet": str          # Email preview text
}

# Calendar events
{
    "time": str,            # "HH:MM" or "(All-day)"
    "title": str,           # Event title
    "location": str         # Event location
}

# Drive tree structure
{
    "Google Drive": {
        "Reports": {"budget.xlsx": None, "plan.docx": None},
        "Notes": {"ideas.md": None}
    }
}
```

**Why:** Panels rely on stable field names; swapping providers or faking data for tests becomes trivial.

---

## 5) Provider Architecture

**Rules**

* Accept **only** plain inputs (IDs, limit, filters).
* Return **DTO lists** or dicts; never Qt types.
* Handle auth inside the provider; cache client objects per instance.
* Add **rate limiting** and **retries with backoff** where appropriate.

**Google provider implementation**

* **Gmail**: fetch message IDs by label → fetch metadata (`From`, `Subject`, `internalDate`) → sort by `internalDate` desc.
* **Calendar**: query `timeMin`/`timeMax` for today in target timezone; map all-day vs timed events.
* **Drive**: build shallow tree (root + one level); **store file IDs** in nodes for later preview/download.

**Error handling**

* Catch exceptions, log once, and **return an empty result** (or cached data). The UI must not crash on provider errors.
* **Fallback to mocks**: When Google API fails, gracefully fall back to mock data.

---

## 6) UI Panels and Columns

**Panel contract**

* Each panel exposes `refresh(self)`; no blocking I/O inside.
* Panels subscribe to worker callbacks (signals) for data delivery.

**Columns (Current Implementation)**

* **Left (Action/Tasks)**: Gmail, Calendar, Project timeline.
* **Center (Content)**: YouTube player + tabbed feeds (Reddit/Discord/Slack/DCInside/RSS).
* **Right (Context/Archives)**: Cloud tree + preview.

**Signal wiring**

* Use Qt signals or the provided `run_in_thread(fn, callback)` to fetch data and push to UI.

---

## 7) Threading & Refresh Cycle

**Do not** call network APIs on the GUI thread.

Current implementation uses a global timer (5 minutes) for refresh:

```python
# In main.py
self.timer = QTimer(self)
self.timer.setInterval(1000*60*5)  # 5 minutes
self.timer.timeout.connect(self.refresh_all)
self.timer.start()
```

**Recommended pattern for new features:**

```python
from app.util.threads import run_in_thread

def refresh(self):
    def fetch():
        return provider.gmail_list(label_names=["IMPORTANT"], max_results=20)
    def done(items):
        self.list.clear()
        for m in items:
            # fill UI
            ...
    def fail(err):
        # optional toast/log
        print("gmail error", err)

    run_in_thread(fetch, done, fail)
```

**Timers**

* Global refresh timer (every 5 min) + per-panel timers if needed (Slack/Discord every 60s).
* Add **jitter** (±10%) to intervals to avoid synchronized spikes.

---

## 8) Caching & Offline Mode

* Use a tiny local cache (`.pynote_cache/` or SQLite) to store last-successful results.
* On startup:

  1. Load cached panel state immediately (fast perceived load)
  2. Kick off fresh fetch in background
  3. Replace UI when new data arrives
* Define TTLs per provider (e.g., Gmail 60s, RSS 5m).

**Current implementation**: Mock providers serve as offline fallback when Google APIs fail.

---

## 9) Rate Limits, Retries, and Backoff

* Wrap HTTP calls with a small helper:

  * **Retry** on 429/5xx (exponential backoff with cap).
  * Respect `Retry-After` headers.
  * Stop after N attempts; surface a soft error/status to the panel.
* Consider **per-provider concurrency caps** (e.g., 2 outstanding requests max).

---

## 10) Logging & Diagnostics

* Use Python `print()` statements for now (to be replaced with proper logging).
* Log:

  * Provider start/finish + duration
  * Errors with stack traces
  * Cache hits/misses
  * Token refresh events (no secrets)

**Future**: Implement proper logging with `~/.pynote/logs/pyNote.log` and **RotatingFileHandler**.

---

## 11) Testing Strategy

**Unit Tests**

* Providers: mock HTTP/SDK layers (`googleapiclient` methods) and assert DTO outputs.
* Use `pytest` + `pytest-mock`; optionally `vcrpy` for HTTP recordings (non-Google providers).

**UI Tests**

* `pytest-qt` for signal/slot interactions; verify lists fill correctly on mock data.
* No visual assertions; test model-to-view linkage.

**Smoke Tests**

* Minimal "launch + render main window + exit" test on CI to catch packaging/import regressions.

---

## 12) Packaging & Distribution (Poetry)

* Use **Poetry** for dependency management (already configured).
* **PyInstaller** with a spec file for distribution:

  * Include `QtWebEngineProcess`, `resources` (icudtl.dat, `qtwebengine_resources.pak`).
  * Test on Windows/macOS/Linux; paths differ.
* Bundle `pynote.yaml` **template**; never bundle user tokens.

**Tip:** Provide a script to copy `credentials.json` into the user's config dir on first run.

---

## 13) Security & Privacy

* Never log message bodies or file contents by default.
* Keep `token.json` in project root (to be moved to OS-specific config dirs).
* Optional: use `keyring` to store refresh tokens.
* **Scraping (e.g., DCInside)**: obey robots.txt/ToS; throttle; provide a "disable scraping" flag.

---

## 14) Internationalization & Theming

* Extract UI text to a small `i18n.py` map or Qt `.ts` files if you'll support multiple languages.
* Persist theme and layout via `QSettings`:

  * Window geometry
  * Splitter sizes
  * Last selected tabs

**Styling**

* Lightweight QSS for dark/light themes. Avoid heavy, global QSS until needed.

---

## 15) Performance Notes

* Avoid creating/destroying heavy widgets repeatedly (e.g., keep one `QWebEngineView`).
* Limit list sizes in panels (e.g., 100 items) and paginate if needed.
* For Drive trees, render shallow and **expand on demand** to avoid O(N) render costs.

---

## 16) Drive Preview Pipeline

**Goal:** Double-click → download/export → preview.

* Tree nodes must carry `{id, name, mime}` in `QTreeWidgetItem.setData(0, Qt.UserRole, payload)`.
* On double-click:

  1. Trigger worker to `download_file(file_id)` (export for Google Docs/Sheets).
  2. Detect type:

     * `.md` → `QTextBrowser.setMarkdown`
     * `.docx` → `python-docx` paragraphs → `setPlainText`
     * `.xlsx` → `openpyxl` first sheet (first ~50 rows) → tab-delimited text
     * Others → show first N KB as text (fallback)
* Cache downloaded files in `.pynote_cache/` with a simple LRU eviction.

---

## 17) Gmail & Calendar Details

**Gmail**

* Prefer `messages.list` with `labelIds` and `maxResults`, then `messages.get(format="metadata", metadataHeaders=[...])`.
* Sort by `internalDate` **descending** to guarantee "latest first".
* Consider query filters:

  * `q`: `label:IMPORTANT is:unread newer_than:7d`
  * Add config knobs in `pynote.yaml`.

**Calendar**

* Compute **today** in `Asia/Seoul` (or configured TZ) with `timeMin/timeMax`.
* Render all-day events as `(All-day)`; display `HH:MM` for timed events.
* Optional: multi-calendar support (IDs in config).

---

## 18) Adding a New Provider (Checklist)

1. **Create adapter** in `app/providers/<name>.py`

   * Implement `fetch_*` methods returning DTOs.
   * Handle auth/token/env.
   * Add retries/backoff.

2. **Add panel** in `app/ui/panels_<name>.py`

   * `refresh()` schedules background fetch.
   * `done(data)` paints UI; handle empty.

3. **Wire into columns**

   * Import panel; add to tabs or column stack.

4. **Add config**

   * Insert default keys into `pynote.yaml` (e.g., channel IDs).

5. **Test**

   * Unit test provider (mock HTTP).
   * Smoke run app; verify no UI freezes.

---

## 19) Error Surfaces and User Feedback

* Panels should show a **non-intrusive status** (e.g., "(temporarily unavailable)") when fetch fails.
* Avoid modal dialogs for background errors; log and keep UI interactive.
* Provide a "Refresh" action in the menu and panel-level "Retry" buttons where useful.

---

## 20) Coding Conventions

* **Imports:** stdlib, third-party, local — in that order.
* **Types:** annotate public functions; use `dataclasses` for DTOs.
* **Naming:** `fetch_*` for providers; `Panel` suffix for UI classes.
* **Docstrings:** Short "what & why"; link to API endpoints if relevant.
* **Limits:** Constants (e.g., default `MAX_RESULTS`) in module scope.

---

## 21) Example Interfaces

**Provider base (optional)**

```python
from typing import Protocol, Iterable
from dataclasses import dataclass

@dataclass
class ProviderResult:
    items: list
    ts: float      # fetch timestamp
    error: str|None = None

class MailProvider(Protocol):
    def list_messages(self, labels: list[str], limit: int) -> ProviderResult: ...
```

**Panel skeleton**

```python
class InboxPanel(QGroupBox):
    def __init__(self, provider: MailProvider):
        super().__init__("Inbox")
        self.provider = provider
        # build widgets...
        self.refresh()

    def refresh(self):
        run_in_thread(
            lambda: self.provider.list_messages(["IMPORTANT"], 20),
            self._on_done,
            self._on_error,
        )

    def _on_done(self, res: ProviderResult):
        self.list.clear()
        if res.error:
            self.list.addItem("(Error fetching messages)")
            return
        for m in res.items:
            self.list.addItem(f"{m.subject} — {m.sender}")

    def _on_error(self, err: Exception):
        self.list.clear()
        self.list.addItem(f"(Error: {err})")
```

---

## 22) Roadmap Hints

* **Drive deep expansion:** Load folder children on expand events rather than prebuilding the whole tree.
* **Indexing:** Keep a `{file_id -> (name,mime)}` map for quick preview lookups.
* **Search:** Add a global search box; query multiple providers concurrently and merge results.
* **Persistence:** Optional SQLite for caching feed items and Drive metadata.

---

## 23) Compliance & UX Notes

* Respect each service's **Terms of Service** and **rate limits**.
* Offer toggles to disable scraping-based sources.
* Provide a **"Data Sources"** panel to explain what's shown and how often it updates.

---

## 24) Quick Wins to Implement Next

1. **Inject file IDs into the Drive tree** and connect to a **Preview** panel (md/docx/xlsx).
2. **Expose Gmail query controls** in `pynote.yaml` (labels, unread, time window).
3. **Persist window geometry/splitter sizes** with `QSettings`.
4. **Add a status bar** with last refresh times per panel.
5. **Implement proper logging** system to replace print statements.
6. **Add error handling** for network failures with user-friendly messages.

---

## 25) Current Implementation Status

**✅ Implemented:**
- Basic UI framework with 3-column layout
- Google API integration (Gmail, Calendar, Drive)
- YouTube player with QWebEngine
- Tab-based content panels
- Auto-refresh system (5-minute intervals)
- Mock data providers as fallback
- Cloud file explorer
- Markdown viewer

**🚧 In Progress:**
- Background threading improvements
- Error handling and user feedback
- Configuration management

**📋 Planned:**
- Slack, Discord, Reddit API integration
- Web scraping for DCInside
- RSS news feed parsing
- File download and preview
- Plugin system
- Theme customization

---

With these guidelines, you should be able to add/replace providers confidently, keep the UI responsive, and maintain a consistent codebase as PyNote grows. The current implementation provides a solid foundation for the Mission Control dashboard concept.
