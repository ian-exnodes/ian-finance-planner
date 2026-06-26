# Implementation Loop Skill

Use this skill for medium+ implementation tasks.

## Purpose

Keep Claude Code working in a reliable loop:

```txt
READ CONTEXT
→ PLAN
→ IMPLEMENT
→ VERIFY
→ SELF REVIEW
→ UPDATE TASKLIST
→ UPDATE MEMORY
→ WRITE CHECKPOINT
→ STOP OR CONTINUE
```

## Required Loop

### 1. Read Context

Read in this order:

1. `AGENTS.md`
2. `CLAUDE.md`
3. Relevant `docs/*.md`
4. `.serena/memories/INDEX.md`
5. Relevant memory files
6. Recent checkpoint from `.serena/checkpoint/active/`
7. Target source files

### 2. Select Task

Open `docs/05-TASKLIST.md`.

Pick the first unchecked task unless the user explicitly chooses another task.

For large tasks, split it into smaller subtasks before coding.

### 3. Plan

State:

- Goal
- Files likely to change
- Success criteria
- Verification command

Keep the plan short.

### 4. Implement

- Make surgical changes.
- Do not refactor unrelated code.
- Use Serena tools for symbol-level work when available.
- Use normal search/edit for strings, docs, config, SQL, and CSS.

### 5. Verify

Run the strongest relevant checks:

```bash
npm run build
npm run lint
npm run typecheck
npm test
```

If a command is unavailable, state that clearly and use the nearest fallback.

### 6. Self Review

Review:

- Correctness
- Type safety
- Vietnamese UI copy
- RLS/security impact
- Mobile/responsive risks
- Unnecessary complexity

Fix issues found during review.

### 7. Update Tasklist

Mark completed tasks in `docs/05-TASKLIST.md`.

Do not mark a task complete if verification failed unless explicitly documenting partial state.

### 8. Update Serena Memory

Update memory only when durable knowledge changed.

### 9. Write Checkpoint

For significant sessions, write a checkpoint to:

```txt
.serena/checkpoint/active/<YYYY-MM-DD_HH-mm>_<agent>_<topic>.md
```

Use local timezone when known.

### 10. Final Response

Report:

- What changed
- Verification performed
- Risks/skipped checks
- Next recommended task

End with the required sentinel from `CLAUDE.md`.
