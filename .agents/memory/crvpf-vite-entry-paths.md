---
name: CRVPF Vite entry paths
description: Path-base handling for the CRVPF multi-page Vite shells.
---

Keep each HTML entry's module script pointing at `/src/main.tsx` in source. Vite resolves that source path during the build and rewrites the emitted asset URL to the configured base path. Use `%BASE_URL%` for public assets and inline route normalization, and `import.meta.env.BASE_URL` for runtime links and assets.

**Why:** Prefixing the source module URL with `%BASE_URL%` made Vite resolve it as a filesystem path and fail the multi-page build.

**How to apply:** When changing page shells or app links, test a production build with the artifact's actual `BASE_PATH`; do not base-prefix the source module entry.
