# React compatibility fixtures

A single fixture that consumes `@constructor-io/constructorio-ui-pia` from a packed tarball and is tested against multiple React versions (16, 17, 18, 19, latest). The CI workflow installs the appropriate React version, types, and testing-library per matrix cell.

Each cell builds with webpack 5 in ESM-output mode (`experiments.outputModule: true`) — strict bare-specifier resolution, the same mode that surfaces `react/jsx-runtime` resolver failures on React 16/17 — and runs a minimal jsdom render of `<CioPia>`.

The CI workflow `.github/workflows/react-compat.yml` runs all cells on every PR. A failing cell blocks merge and publish.

If any future runtime dependency reintroduces a published ESM `import 'react/jsx-runtime'` (or any other bare specifier that React 16/17 doesn't expose via `exports`), the React 16 and 17 cells will fail with `Module not found: Error: Can't resolve 'react/jsx-runtime'`.

The fixture's `webpack.base.cjs` pins `resolve.modules` to the fixture's own `node_modules` so webpack cannot fall through to the library's hoisted React install and mask the failure.

## Adding a new React version

New React majors are picked up automatically from npm. The `resolve-matrix` job in `.github/workflows/react-compat.yml` discovers all stable majors >= 16 at runtime.

If a future React version changes the render API (replacing `createRoot`), add a new entry point (e.g. `index-future.tsx`) and update the version threshold in the matrix script.

## Local repro

```bash
npm ci
npm run compile
npm pack --pack-destination .
mv constructor-io-constructorio-ui-pia-*.tgz constructorio-ui-pia.tgz
cd test/react-compat/fixture
npm install

# React 18+ (modern)
npm install react@18.3.1 react-dom@18.3.1 @testing-library/react@latest
ENTRY=index-modern npm run build
npm test

# React 16/17 (legacy)
npm install react@16.14.0 react-dom@16.14.0 @testing-library/react@12.1.5
ENTRY=index-legacy npm run build
npm test
```
