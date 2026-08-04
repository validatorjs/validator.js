# validator.js Threat Model

## Document control

| Field | Value |
| --- | --- |
| Project | `validatorjs/validator.js`: the `validator` npm package and browser builds generated from `src/` |
| Document type | Non-binding security-review and threat-modeling guidance |
| Version coverage | The current release, consistent with `SECURITY.md`; older releases require separate analysis |
| Audience | Maintainers, integrators, security reviewers, and AI agents |

This document describes validator.js's security boundaries, expected properties, threat scenarios, possible controls, and non-binding guidance for classifying reported findings.

This document provides non-binding guidance for security review. It does not establish vulnerability eligibility, require any particular disposition, or limit the maintainers' discretion to accept, reject, reclassify, or close a report for any reason. The README, security policy, and release documentation remain authoritative for current public guarantees. Section 9 provides non-normative integration guidance.

## 1. Scope

### In scope

- Public validators, sanitizers, normalizers, converters, exported locale lists, and related options.
- Shared helpers and static data under `src/` when they affect public API behavior.
- Node.js, ES module, and browser builds generated from `src/`.
- The official build and npm publication path insofar as it determines whether reviewed source corresponds to an official package.
- Library-owned validation, sanitization, normalization, conversion, option handling, error behavior, and resource use.
- Interactions between public APIs and shared internal helpers.

### Out of scope

- Application authentication, authorization, tenant policy, business rules, rate limiting, storage constraints, output encoding contexts, and sink selection.
- Whether an application should accept a particular email address, URL, identifier, locale, currency format, or other value as a matter of business policy.
- Independent vulnerabilities in JavaScript engines, Node.js, browsers, operating systems, package registries, and development tools unless validator.js causes or unnecessarily exposes the unsafe behavior.
- Generated artifacts when they faithfully represent `src/`; build divergence is a release-engineering concern that may warrant separate investigation.
- Third-party wrappers and integrations except where validator.js itself violates a documented guarantee.

validator.js currently ships no runtime dependencies. Development dependencies do not form part of the installed library's runtime attack surface, although they remain relevant to repository and release security.

The security policy guarantees fixes only for the current version. Applying this document to an older release requires separate consideration of that release's documented behavior and implementation.

## 2. Architecture and boundaries

```text
                  Caller
                    |
        primary string + API arguments
                    |
                    v
             Public API export
                    |
          assertion / option merge
                    |
                    v
       validator, sanitizer, parser,
       converter, lookup, or helper
                    |
                    v
       boolean / transformed value / value
                    |
                    v
            Application consumer

  Static locale/format data ------^
  JavaScript runtime <---- language and platform operations

  Reviewed source --> CI build/test --> GitHub release --> npm package
```

### API channels

Review behavior according to the channel through which data enters the API. These are neutral technical classifications, not trust labels.

| Channel | Examples | Expected handling |
| --- | --- | --- |
| Primary string | The main value passed to a public API | Apply the documented operation deterministically without unexpected exceptions or disproportionate processing. |
| Ordinary options | Length limits, locale, formatting choices, case behavior, or feature flags | Validate or interpret them consistently with the documented contract. |
| Policy options | Lists or rules that constrain accepted values | Apply them consistently according to their documented comparison semantics. |
| Character and pattern arguments | Characters or patterns supplied through documented options | Interpret them consistently with the documented grammar and result contract. |
| Locale or format selector | Country code, locale, algorithm, provider, or version | Support documented selectors and fail predictably for unsupported selectors. |
| Static standards data | Country, currency, phone, postal, identity, and format tables | Keep data maintainable and testable; data inaccuracies alone are correctness issues under this model. |

This model does not consider whether data is attacker controlled. It assesses the library's behavior from the exact invocation and relevant preconditions, without using the data's provenance to include or exclude a finding.

The primary arguments of validator.js APIs are documented as strings. Other supported types are determined by the relevant public API documentation. Getters, proxies, custom coercion, cyclic object graphs, and other JavaScript object behavior are not implicitly supported merely because JavaScript permits them; affirmative guarantees for such behavior come from the relevant API documentation.

### Trust boundaries

| Boundary | Crossing data | validator.js responsibility |
| --- | --- | --- |
| TB-1 Caller → public API | Primary string and other documented arguments | Enforce the documented type and result contract predictably. |
| TB-2 Public API → shared helpers | Values, parsed components, and options | Preservation of caller guarantees and consistent transformation and error behavior. |
| TB-3 Library result → application consumer | Validation result or transformed value | Return the documented result and clearly state its limitations. |
| TB-4 Source → generated builds | Transpiled modules and browser bundle | Consistency with source behavior, including applicable security fixes. |
| TB-5 Library → JavaScript runtime | Language and platform operations | Preservation of the documented API contract when using runtime facilities. |
| TB-6 Reviewed source → official package | Source, generated artifacts, release metadata, workflow identity, and package contents | Correspondence between the published package, reviewed revision, and authorized release. |

validator.js performs no network, filesystem, database, or process-spawning operations during ordinary library use and maintains no cross-request state.

## 3. Assets and security-relevant effects

### Assets

- Availability of the JavaScript event loop, request handler, browser context, and process.
- Integrity of validation and sanitization policy decisions made through documented options.
- Integrity of documented option and policy decisions.
- Predictability of documented string and numeric operations.
- Consistency of behavior across Node.js, ES module, and browser distributions.
- Integrity and authenticity of official releases and published package contents.

### Security-relevant effects

- Unexpected synchronous exceptions that escape a documented validator or sanitizer invocation.
- Disproportionate CPU, memory, or output expansion caused by library-owned processing.
- Injection of syntax into a context documented as literal data.
- Failure to apply a documented option or policy consistently.
- Cross-API inconsistencies that invalidate a public caller's documented guarantee.
- Unauthorized or substituted code in an official distribution.

Returning an incorrect validation result without one of these or another independently meaningful effect is not sufficient.

## 4. Expected security properties

### Expected properties

1. A documented validator invocation with a string primary argument returns a boolean unless the API explicitly documents another result or a deliberate error condition.
2. Sanitizers and normalizers return deterministic transformed values consistent with their documented grammar and do not execute text that is documented as literal data.
3. Converters return their documented value or failure representation without leaking unrelated native exceptions for supported input types.
4. Options that constrain accepted values are applied consistently with their documented semantics.
5. Parsing and normalization behavior is consistent with the API's documented interpretation of a value.
6. Library-owned processing is bounded and proportionate to input size and documented options.
7. Unicode and text-encoding behavior is deterministic and consistent with the documented contract.
8. Options are interpreted consistently with their documented grammar.
9. Shared helpers preserve the guarantees of every public caller; changes to one API are not expected to silently break another caller's documented behavior.
10. Generated distributions are expected to preserve the security behavior and tests of the source implementation.
11. Official packages are expected to correspond to reviewed source and use the authorized release process.

### Explicit non-guarantees

validator.js does **not** provide:

- application authentication, authorization, tenant isolation, or business-policy enforcement;
- proof that an accepted value is safe for every possible application use or output context;
- contextual HTML, JavaScript, CSS, SQL, shell, URL, or template sanitization beyond the exact documented sanitizer transformation;
- verification that an email address, phone number, payment instrument, cryptocurrency address, tax identifier, or other identifier exists, is owned by anyone, or is authorized for a transaction;
- complete enforcement of external standards or application-specific format requirements beyond the behavior the API documents;
- protection from resource behavior of a caller-supplied `RegExp` where accepting and executing that pattern is the documented API contract;
- security merely because a validator returns `true`; sink-specific policy remains an application concern.

A function returning the wrong answer is not, by itself, a security vulnerability. An incorrect result is a correctness bug unless an additional property of validator.js behavior independently establishes a meaningful security consequence.

## 5. Threat scenarios

These are review scenarios, not assertions of current vulnerabilities.

| ID | Category | Surface | Scenario and possible effect | Expected control |
| --- | --- | --- | --- | --- |
| EXC-01 | Availability | Public APIs and shared helpers | A supported invocation reaches an operation that throws an undocumented exception, disrupting a validation call or request. | Preservation of the documented result and error contract across public APIs and shared callers. |
| DOS-01 | Availability | Static regular expressions | A crafted long string causes superlinear or catastrophic backtracking. | Structurally linear expressions, appropriate bounds, and bounded performance tests. |
| DOS-03 | Availability | Parsers and sanitizers | Repeated splitting, replacement, normalization, or output expansion causes disproportionate work or memory use. | Work and output proportionate to input size, supported by bounded-input tests. |
| SAN-01 | Integrity / misuse | Sanitizers and normalizers | A transformation is treated as safe for a context outside its documented behavior. | Documentation of the exact transformation and consideration of whether any independent validator.js behavior is involved. |
| API-01 | Integrity | Shared helpers and composed APIs | A change to shared implementation alters another public API's documented behavior. | Review of public callers and deliberate treatment of compatibility. |
| BUILD-01 | Integrity | Generated distributions | Source behavior differs from Node, ES module, or browser artifacts. | Representative testing of distributed forms. |
| SUP-01 | Authenticity / integrity | Release and publication | An unauthorized or substituted package is published through an official channel. | Restricted publishing authority and verifiable correspondence between source and package. |
| COR-01 | Correctness | Validators and sanitizers | A function returns an incorrect result without producing an independent security effect. | Treatment as correctness rather than a security vulnerability. |

This scenario list is a starting taxonomy, not evidence of completeness. A future assurance review could examine each architecture boundary for confidentiality, integrity, availability, authenticity, and accountability effects.

## 6. Possible security control patterns

| Control | Possible practice | Limitation |
| --- | --- | --- |
| Predictable type contract | Consistent validation of primary string types and documentation of deliberate errors for unsupported selectors or option forms. | Type checking alone does not prevent native exceptions later in processing. |
| Consistent option handling | Application of validation and transformation options according to their documented semantics. | Library options do not decide application authorization or business policy. |
| Bounded processing | Linear or demonstrably bounded algorithms and regexes, without hidden cross-operation state. | Large linear input can still require application-level limits. |
| Text-processing semantics | Definition of the relevant string and encoding semantics for APIs whose behavior depends on them. | One form of length or text validation does not imply another unless documented. |
| Cross-caller review | Inspection of importers when changing a shared helper. | Passing unit tests for one API does not prove compatibility for its callers. |
| Build parity | Representative testing of all distributed forms. | Generated artifacts should not be treated as independent source during ordinary review. |
| Release integrity | Restricted release authority and traceability from a published package to reviewed source. | Repository controls cannot independently guarantee registry or hosting-platform security. |
| Explicit sink limitations | Documentation of what a validator or sanitizer does not guarantee. | Documentation cannot excuse violation of an affirmative API guarantee. |

## 7. Suggested finding dispositions and review priority

The following dispositions may help organize findings. Maintainers retain discretion over whether and how to use them.

1. **Library responsibility** — validator.js appears to violate a documented guarantee or an expected security property in Section 4 during documented or reasonably supported use. This classification suggests that remediation could belong in validator.js.

   Examples include a supported invocation violating its documented result contract or library-owned processing introducing disproportionate resource use.

2. **Shared responsibility** — validator.js appears to introduce an independent unsafe behavior, but the complete security impact additionally requires an application or operational failure. The complete path and independent validator.js behavior are relevant to this classification.

3. **Application misuse / defense-in-depth** — validator.js preserves its invariants and introduces no independent unsafe behavior, but the application relies on a guarantee the API does not make or uses an explicitly executable/raw channel as passive data.

4. **Runtime / operating-system issue** — the failure appears to belong wholly to JavaScript, Node.js, a browser, or the operating system, and validator.js neither causes nor unnecessarily exposes it. Referral to the responsible project may be appropriate.

For a time-bounded review, maintainers expressed the following preference without limiting their discretion:

1. Focus first on **Library responsibility** findings.
2. Consider **Shared responsibility** findings if time remains.
3. Use the remaining categories when helpful for completeness.

A native runtime failure may fit Library responsibility when validator.js unnecessarily exposes it through a supported invocation, subject to maintainer judgment.

## 8. Suggested severity methodology

Severity is generally most useful after establishing the exact behavior and a tentative disposition. When a formal score is recorded, the applicable disclosure or advisory process determines the scoring method and version; this document does not replace that process.

- **Impact:** confidentiality or integrity bypass, code execution, or broad persistent denial of service is high impact. A recoverable request-level exception is generally lower impact.
- **Blast radius:** distinguish one validation call or request from process-wide, cross-user, or persistent effects.
- **Reachability:** consider the relevant API options, input shape, environment, downstream interpretation, and application preconditions without assigning trust labels to arguments.
- **Recoverability:** consider whether retry, exception handling, restart, configuration, or upgrade restores service.

Starting guidance:

- **Critical:** exceptional impact across many consumers, such as compromise of an authorized distribution channel.
- **High:** high impact with broad blast radius or straightforward reachability.
- **Medium:** meaningful impact with a limited blast radius or material preconditions.
- **Low:** narrow, readily recoverable impact with significant preconditions.
- **Informational:** useful hardening or integration guidance that does not establish a validator.js vulnerability.

Application misuse and runtime/operating-system dispositions ordinarily would not receive validator.js vulnerability severity. For Shared responsibility, considering the complete path without counting the same precondition twice can improve consistency.

A useful decision record may include the disposition, affected versions, exact preconditions, impact, blast radius, recoverability, severity rationale, scoring vector if one is used, and supporting evidence. Serious integration risk may be recorded separately from validator.js vulnerability severity.

## 9. Non-normative integration guidance

Applications using validator.js should:

- treat validation as one input-processing step rather than authentication or authorization;
- apply explicit, context-specific application policy before using accepted values;
- use contextual encoders or sanitizers appropriate to the eventual HTML, JavaScript, CSS, URL, SQL, shell, or template sink;
- impose application-level request, input-size, concurrency, and resource limits even when library operations are linear;
- validate application-specific business and external-standard requirements separately where needed;
- catch exceptions at request or task boundaries as general resilience, without relying on that as a substitute for predictable library behavior;
- pin reviewed releases and ensure generated artifacts contain applicable security fixes.

## 10. Primary references

- [validator.js README](README.md)
- [validator.js security policy](SECURITY.md)
- [Package metadata and scripts](package.json)
- [npm publication workflow](.github/workflows/npm-publish.yml)
- [ECMAScript specification](https://tc39.es/ecma262/)
