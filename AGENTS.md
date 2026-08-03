# AGENTS.md

This file provides guidance to AI coding agents working with this repository.

## Project map

- validator.js is a single-package npm project for string validation and sanitization.
- `src/index.js` defines the public exports, and `src/lib` contains validators, sanitizers, normalizers, converters, static format data, and shared utilities.
- `test/validators.test.js` contains most API tests; additional test files cover browser builds and individual utilities.
- `README.md` is the primary public API reference. Update it when documented API behavior or options change.
- `build-browser.js` creates the browser bundle. Babel creates the Node and ES module distributions.
- `index.js`, `lib/`, `es/`, `validator.js`, and `validator.min.js` are generated. Do not edit or commit them manually.
- The published package contains only the generated distributions, `README.md`, `LICENSE`, and package metadata listed in the `files` field of `package.json`.
- validator.js has no runtime dependencies. The packages in `devDependencies` are used only to build, lint, and test the project.

## Branching and pull requests

- Normal changes target `master`.
- Keep changes focused on the reported behavior. Avoid unrelated API, formatting, generated-file, or data-table changes.
- Bug fixes should include a focused regression test that fails before the fix and passes afterward.
- Follow the style of recent commit and pull-request titles; the repository does not define a separate title convention in `CONTRIBUTING.md`.

## Install and build

- Use npm for the official build and test path.
- Install development dependencies with `npm install --legacy-peer-deps`, as documented in `CONTRIBUTING.md` and used by CI.
- Prefer the latest Node.js LTS release for local development. When adding syntax or runtime APIs, follow the compatibility range declared in `package.json` and verify compatibility with the Node.js versions supported by CI.
- Run `npm run build` to generate the Node, ES module, and browser distributions.
- Do not infer a source change from generated output alone; inspect the corresponding file under `src/`.

## Test

- `npm test` is the broad local check. Its `pretest` lifecycle builds every distribution and runs ESLint before the Mocha suite.
- `npm run lint` checks `src/` and `test/`.
- `npm run build` builds all published forms without running the tests.
- For a focused Mocha run, use `npm test -- --grep '<test name>'`; retain the broad `npm test` run before considering a code change complete.
- Tests use Mocha, Babel, and nyc. Coverage output under `coverage/` and `.nyc_output/` is generated and should not be committed.
- When changing a shared helper, identify and test its public callers. A helper-level test alone does not establish public API behavior.
- When changing behavior represented in multiple distributions, verify the source implementation and the relevant generated form rather than editing generated files.
- If a command fails during setup, distinguish dependency, Node-version, filesystem, and tooling failures from product-code failures before changing source.

## Change discipline

- Preserve documented behavior and compatibility outside the stated scope of a change.
- Prefer the smallest root-cause fix over special-casing a reported input.
- Keep static locale and format data changes separate from algorithm changes when practical.
- Do not update generated distributions manually; building and publishing generate them from `src/`.
- Do not commit, push, publish a package or advisory, open an issue or pull request, or disclose private security material unless explicitly authorized.

## Documentation and threat model

- Update `README.md` when a public API, option, return contract, or documented limitation changes.
- Read `SECURITY.md` for the supported-version and vulnerability-reporting policy.
- Read `THREAT_MODEL.md` before triaging a suspected vulnerability.
- Do not place private advisories, unpublished findings, reporter information, or private bug-hunt results in public documentation.

## Security analysis

- Before describing a finding as novel, check open and closed issues, pull requests, published advisories, available approved private advisory material, tests, documentation, changelog entries, and relevant source history.
- Prefer rejecting speculative candidates over presenting unsupported security conclusions.

## Security reproduction standards

- Start from a documented or reasonably supported public API invocation. An internal-helper test alone does not demonstrate public behavior unless that helper is itself public.
- State the exact arguments, options, environment, expected documented behavior, observed behavior, independent security effect, and relevant preconditions.
- Add a focused regression test that expresses the expected correct behavior rather than an incidental implementation detail.
- Run the test against the unchanged implementation and confirm that it fails for the stated reason. If the behavior does not reproduce, stop and report the evidence instead of modifying source.
- After a fix, confirm that the focused test passes and run `npm test` to check the generated builds, lint, and existing test suite.
- Keep reproductions safe, local, bounded, self-contained, and readable. Do not contact external targets or run unbounded denial-of-service payloads.
- Report the root cause, files changed, before-and-after results, compatibility effects, assumptions, and remaining limitations.
