from __future__ import annotations

import os
import subprocess
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit


WORKSPACE = Path(__file__).resolve().parent
APP_DIR = WORKSPACE / "artifacts" / "crvpf-demo"
PUBLIC_DIR = APP_DIR / "dist" / "public"
PORT = int(os.environ.get("PORT", "5000"))
BASE_PATH = os.environ.get("BASE_PATH", "/").rstrip("/")

ROUTE_FILES = {
    "/": "index.html",
    "/about": "about.html",
    "/programmes": "programmes.html",
    "/programmes/pvac": "pvac.html",
    "/programmes/agpp": "agpp.html",
    "/programmes/eydcd": "eydcd.html",
    "/programmes/coordinated": "coordinated.html",
    "/programmes/joint": "joint.html",
    "/impact": "impact.html",
    "/where-we-work": "where-we-work.html",
    "/resources": "resources.html",
    "/get-involved": "get-involved.html",
    "/publications": "publications.html",
    "/inception": "inception.html",
    "/audit": "audit.html",
    "/analytics": "analytics.html",
    "/hosting": "hosting.html",
}


def build_if_needed() -> None:
    built_index = PUBLIC_DIR / "index.html"
    source_files = [
        *APP_DIR.glob("*.html"),
        *APP_DIR.joinpath("src").rglob("*"),
        *APP_DIR.joinpath("public").rglob("*"),
        APP_DIR / "vite.config.ts",
    ]
    newest_source = max(
        (item.stat().st_mtime for item in source_files if item.is_file()),
        default=0,
    )
    if built_index.is_file() and built_index.stat().st_mtime >= newest_source:
        return

    env = os.environ.copy()
    env.setdefault("PORT", str(PORT))
    env.setdefault("BASE_PATH", os.environ.get("BASE_PATH", "/"))
    print("Building the CRVPF site before starting the Python web server...", flush=True)
    subprocess.run(
        ["pnpm", "--filter", "@workspace/crvpf-demo", "run", "build"],
        cwd=WORKSPACE,
        env=env,
        check=True,
    )


class CRVPFRequestHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path: str) -> str:
        pathname = unquote(urlsplit(path).path)
        if BASE_PATH and pathname.startswith(BASE_PATH):
            pathname = pathname[len(BASE_PATH) :] or "/"
        pathname = "/" + pathname.lstrip("/")

        if pathname == "/favicon.ico":
            return str(PUBLIC_DIR / "crvpf-official-logo.png")

        route_file = ROUTE_FILES.get(pathname.rstrip("/") or "/")
        if route_file:
            return str(PUBLIC_DIR / route_file)

        translated = super().translate_path(pathname)
        if Path(translated).is_file():
            return translated

        # Keep React routes functional for the parts that are not separate
        # HTML entry points.
        if not Path(pathname).suffix:
            return str(PUBLIC_DIR / "index.html")
        return translated


if not 1 <= PORT <= 65535:
    raise ValueError(f"Invalid PORT value: {PORT}")

build_if_needed()
server = ThreadingHTTPServer(
    ("0.0.0.0", PORT),
    lambda *args, **kwargs: CRVPFRequestHandler(
        *args, directory=str(PUBLIC_DIR), **kwargs
    ),
)
print(
    f"CRVPF running on {PORT} - Pages: / /about /programmes /impact /resources "
    "/publications /inception /audit /analytics /hosting",
    flush=True,
)
server.serve_forever()
