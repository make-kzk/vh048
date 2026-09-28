#!/usr/bin/env python3
"""Static file server for local vh48 mockups — no cache, live reload, auto git sync."""

from __future__ import annotations

import http.server
import json
import os
import socketserver
import subprocess
import sys
import threading
import time
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent.parent
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
AUTO_SYNC = os.environ.get("VH48_AUTO_SYNC", "1") != "0"
SYNC_INTERVAL = int(os.environ.get("VH48_SYNC_INTERVAL", "15"))
SERVER_STARTED = time.time()
COMMIT_LOCK = threading.Lock()
CURRENT_COMMIT = "unknown"

WATCH_SUFFIXES = {".html", ".css", ".js", ".json"}
WATCH_PATHS = (
    ROOT / "mockups",
    ROOT / "assets",
    ROOT / "local",
    ROOT / "index.html",
    ROOT / "catalog.json",
    ROOT / "presentation.html",
)

LIVERELOAD_SNIPPET = b'<script src="/__livereload.js"></script>'


def git_commit() -> str:
    try:
        result = subprocess.run(
            ["git", "-C", str(ROOT), "rev-parse", "--short", "HEAD"],
            capture_output=True,
            text=True,
            check=True,
        )
        return result.stdout.strip() or "unknown"
    except (subprocess.CalledProcessError, FileNotFoundError):
        return "unknown"


def get_commit() -> str:
    with COMMIT_LOCK:
        return CURRENT_COMMIT


def set_commit(value: str) -> None:
    global CURRENT_COMMIT
    with COMMIT_LOCK:
        CURRENT_COMMIT = value


def dev_banner(commit: str) -> bytes:
    text = (
        f'<div id="vh48-dev-banner" style="position:fixed;bottom:0;left:0;right:0;'
        f"z-index:9999;background:#111;color:#fff;font:600 12px/1.4 system-ui,sans-serif;"
        f'padding:8px 12px;text-align:center;pointer-events:none;">'
        f"vh48 local · {commit} · auto-sync + auto-reload</div>"
    )
    return text.encode()


LIVERELOAD_CLIENT = b"""\
(function () {
  var last = null;
  function tick() {
    fetch('/__livereload?t=' + Date.now(), { cache: 'no-store' })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (last !== null) {
          if (data.v !== last.v || data.commit !== last.commit) location.reload();
        }
        last = data;
      })
      .catch(function () {});
  }
  setInterval(tick, 400);
  tick();
})();
"""


def compute_version() -> float:
    latest = SERVER_STARTED
    for base in WATCH_PATHS:
        if not base.exists():
            continue
        if base.is_file():
            latest = max(latest, base.stat().st_mtime)
            continue
        for path in base.rglob("*"):
            if path.is_file() and path.suffix.lower() in WATCH_SUFFIXES:
                latest = max(latest, path.stat().st_mtime)
    return latest


def inject_dev_tools(content: bytes) -> bytes:
    banner = dev_banner(get_commit())
    if b'id="vh48-dev-banner"' not in content and b"</body>" in content:
        content = content.replace(b"</body>", banner + LIVERELOAD_SNIPPET + b"</body>", 1)
    elif LIVERELOAD_SNIPPET not in content and b"</body>" in content:
        content = content.replace(b"</body>", LIVERELOAD_SNIPPET + b"</body>", 1)
    return content


def git_sync_once() -> bool:
    """Fetch and fast-forward pull origin/main when behind."""
    try:
        subprocess.run(
            ["git", "-C", str(ROOT), "fetch", "origin", "main"],
            capture_output=True,
            check=True,
            timeout=30,
        )
        behind = subprocess.run(
            ["git", "-C", str(ROOT), "rev-list", "HEAD..origin/main", "--count"],
            capture_output=True,
            text=True,
            check=True,
            timeout=10,
        )
        if int(behind.stdout.strip() or "0") <= 0:
            return False

        subprocess.run(
            ["git", "-C", str(ROOT), "pull", "--ff-only", "origin", "main"],
            capture_output=True,
            check=True,
            timeout=30,
        )
        set_commit(git_commit())
        print(f"Auto-synced to origin/main ({get_commit()})", flush=True)
        return True
    except (subprocess.CalledProcessError, subprocess.TimeoutExpired, ValueError) as err:
        print(f"Auto-sync skipped: {err}", flush=True)
        return False


def git_sync_loop() -> None:
    while True:
        git_sync_once()
        time.sleep(SYNC_INTERVAL)


class LiveReloadHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, fmt: str, *args) -> None:
        if args and isinstance(args[0], str) and args[0].startswith("/__livereload"):
            return
        super().log_message(fmt, *args)

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("X-VH48-Commit", get_commit())
        super().end_headers()

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        route = parsed.path

        if route == "/__livereload":
            payload = json.dumps({"v": compute_version(), "commit": get_commit()}).encode()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
            return

        if route == "/__livereload.js":
            self.send_response(200)
            self.send_header("Content-Type", "application/javascript; charset=utf-8")
            self.send_header("Content-Length", str(len(LIVERELOAD_CLIENT)))
            self.end_headers()
            self.wfile.write(LIVERELOAD_CLIENT)
            return

        file_path = Path(self.translate_path(route))
        if file_path.is_file() and file_path.suffix.lower() == ".html":
            content = inject_dev_tools(file_path.read_bytes())
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(content)))
            self.end_headers()
            self.wfile.write(content)
            return

        super().do_GET()


def main() -> None:
    set_commit(git_commit())
    if AUTO_SYNC:
        threading.Thread(target=git_sync_loop, daemon=True, name="vh48-git-sync").start()
        print(f"Auto-sync:    every {SYNC_INTERVAL}s from origin/main", flush=True)

    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("127.0.0.1", PORT), LiveReloadHandler) as httpd:
        print(f"Serving {ROOT} at http://127.0.0.1:{PORT}/", flush=True)
        print(f"Git commit:   {get_commit()}", flush=True)
        print("Live reload:  save file or remote push → page refreshes", flush=True)
        print("Press Ctrl+C to stop.", flush=True)
        httpd.serve_forever()


if __name__ == "__main__":
    main()
