[![Build and Publish](https://github.com/codesqueak/motd-ui/actions/workflows/build-publish.yml/badge.svg)](https://github.com/codesqueak/motd-ui/actions/workflows/build-publish.yml)

# motd-ui

React + TypeScript + Vite frontend for the [Message of the Day](https://github.com/codesqueak/motd) service.
A single page fetches a random message and the total message count from `motd`'s `/api/motd` and
`/api/motd/count` endpoints and displays them.

In production this is built into a static bundle and served by nginx, which also reverse-proxies `/api/`
requests to the `motd` backend Service - see `nginx.conf` and
[install-motd.md](https://github.com/codesqueak/gitops/blob/main/install-motd.md) in the gitops repo for
how that's wired up.

## Development

```bash
npm ci
npm run dev       # start the Vite dev server with HMR
npm run lint       # eslint
npm run build      # type-check (tsc) + production build
npm run preview    # preview the production build locally
```

`npm run dev` proxies `/api` requests to `http://localhost:8000` (see `vite.config.ts`), so a `motd` backend
needs to be reachable there - e.g. `./gradlew bootRun` locally, or `kubectl port-forward svc/motd-dev 8000:8000
-n app-motd-dev` against the cluster. In the deployed cluster, nginx does this proxying instead (see
`nginx.conf`).
