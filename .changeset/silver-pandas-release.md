---
'desktop': patch
---

CI/CD overhaul: upgraded GitHub Actions to latest majors, switched to a
fully manual release flow (changesets run locally, tag push triggers the
build), added Dependabot auto-merge, and made the pipeline fail fast on
mismatched release tags.
