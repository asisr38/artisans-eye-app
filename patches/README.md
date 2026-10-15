# React Three Fiber Timer compatibility patch

`@react-three/fiber@9.6.1` still constructs the deprecated `THREE.Clock`. The latest stable 9.7.0 source also retains it; upstream discussion: https://github.com/pmndrs/react-three-fiber/issues/3741.

The pnpm patch replaces that construction in the ESM and development/production CommonJS bundles with a small Timer-backed adapter. It keeps Fiber 9's public `clock` fields and start/stop/getDelta/getElapsedTime semantics, including manual `advance()` and demand-loop restarts. The Timer constructor is passed from Fiber's existing Three.js import to avoid a second Three.js bundle. There are no warning filters or browser listeners.

`pnpm install` reapplies the patch using `pnpm-workspace.yaml` and the lockfile. No postinstall mutation is needed. Run `pnpm test` for regression coverage against the installed Fiber store. When upgrading Fiber, remove or rebase the patch and retain those checks; prefer upstream Timer support when available.
