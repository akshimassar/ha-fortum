# Agent Notes

Minimal guidance for AI/code agents working in this repository.

## Scope
- This repo contains a Home Assistant custom integration at `custom_components/mittfortum`.
- Prefer small, focused changes that preserve existing behavior and startup performance.

## Key Paths
- Integration code: `custom_components/mittfortum`
- Coordinators: `custom_components/mittfortum/coordinators.py`
- Tests: `tests/unit`, `tests/integration`, `tests/e2e`
- Contributor docs: `DEVELOPMENT.md`

## Workflow
1. Read relevant files first.
2. Implement the smallest safe change.
3. Add or update tests for behavior changes.
4. Run checks before committing.

## Comments
- Prefer intent-focused comments; do not add comments that only restate obvious names or code flow.

## Required Validation
- `uv run ruff check custom_components/mittfortum tests`
- `uv run pytest` (or targeted subsets when appropriate)

## Safety and Logging
- Never log secrets/tokens/cookies/session payloads.
- Avoid destructive git operations unless explicitly requested.
- Keep debug logs useful but concise.

## Commit Guidelines
- Use an imperative, concise title.
- Include a brief description/body (1-3 lines) explaining what changed and why.
