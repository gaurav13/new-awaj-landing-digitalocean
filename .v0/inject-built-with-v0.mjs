/**
 * v0 build hook used by Vercel projects linked from v0.app.
 * The full injector ships in the v0 sandbox; this repo keeps a no-op so
 * `node .v0/inject-built-with-v0.mjs && next build` succeeds on deploy.
 */
console.log("[v0] inject-built-with-v0: no-op (standalone deployment)")
