---
name: ship
description: Commit the current working-tree changes and ship them to main via a brand-new pull request that is auto-merged. Use whenever changes are ready to go live. The user's standing preference for this repo is ALWAYS a fresh PR + auto-merge to main — never push straight to main, never reuse an already-merged PR.
---

# Ship to main (new PR + auto-merge)

The user's standing rule for `actorjoon0001-glitch/seum-visit-new`:
**every change ships as a new pull request into `main`, and that PR is auto-merged.**

## Development branch
Always develop on `claude/showroom-selection-feature-cw5qk6`.

## Before editing files (start each change from latest main)
```
git fetch origin main
git checkout -B claude/showroom-selection-feature-cw5qk6 origin/main
```
This keeps every change stacked on the newest `main` and avoids reviving
already-merged history. (If the branch still carries un-pushed work you must
keep, rebase it onto `origin/main` instead of resetting.)

## Ship steps (run when changes are ready)
1. Stage & commit with a clear Korean summary. End every commit message with:
   ```
   Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
   Claude-Session: https://claude.ai/code/session_01SC6fgRnxDhCUBKAmTJey4k
   ```
2. Push: `git push -u origin claude/showroom-selection-feature-cw5qk6`
   (use `--force-with-lease` when the branch was rebuilt on `origin/main`).
3. Open a NEW PR into `main` with `mcp__github__create_pull_request`
   (base: `main`, head: the branch). Body ends with:
   ```
   🤖 Generated with [Claude Code](https://claude.com/claude-code)
   ```
4. Auto-merge it with `mcp__github__merge_pull_request` (merge_method: `merge`).
5. Report the PR number + URL back to the user.

## Rules
- Never push directly to `main`; never skip the PR.
- One logical change = one PR. Don't stack new commits on already-merged history.
- Do NOT put the model identifier in commit messages, PR titles/bodies, or code.
- If a merge conflict or non-fast-forward appears, re-sync from `origin/main`
  (`git checkout -B <branch> origin/main`, re-apply), then re-open the PR.
