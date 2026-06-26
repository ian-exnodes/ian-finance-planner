# SETUP_STEPS.md

# Step-by-step: How to Start This Project with Claude Code + Serena

## 1. Create a new folder

```bash
mkdir finance-planner
cd finance-planner
```

## 2. Copy starter kit files

Copy everything from this starter kit into the new folder.

Expected files:

```txt
CLAUDE.md
AGENTS.md
docs/
.agents/
.serena/
```

## 3. Open the folder in your editor

```bash
code .
```

## 4. Start Claude Code inside this folder

Open Claude Code from the project root.

Make sure Claude can see:

```txt
CLAUDE.md
AGENTS.md
docs/05-TASKLIST.md
.serena/memories/INDEX.md
```

## 5. First message to Claude Code

Use this exact prompt:

```txt
Read AGENTS.md and CLAUDE.md first.

Then read:
- docs/01-PRD.md
- docs/02-ARCHITECTURE.md
- docs/03-DATABASE.md
- docs/04-DESIGN_SYSTEM.md
- docs/05-TASKLIST.md
- .serena/memories/INDEX.md

Use the implementation loop skill if available.

Start Phase 0 from docs/05-TASKLIST.md.
Implement one small task group at a time.
After each significant task:
- run relevant verification
- update docs/05-TASKLIST.md
- update Serena memory if durable knowledge changed
- write a checkpoint under .serena/checkpoint/active

The app UI must be Vietnamese. Technical code/docs can stay English.
```

## 6. When Claude finishes one task

Say:

```txt
Continue with the next unchecked task in docs/05-TASKLIST.md.
```

## 7. When Claude seems confused

Say:

```txt
Reboot context using CLAUDE.md Adaptive Session Boot Protocol.
Read .serena/memories/INDEX.md and the latest active checkpoint before touching source code.
Then continue the current task.
```

## 8. When you want Supabase setup

Ask Claude:

```txt
Implement the database migration from docs/03-DATABASE.md.
Then tell me exactly what SQL to run in Supabase.
```

## 9. When you want deployment

Ask Claude:

```txt
Read docs/08-DEPLOYMENT.md and prepare the project for Vercel deployment.
Run build and fix all blocking issues.
```

## 10. Recommended working cadence

Do not ask Claude to build the entire app in one message.

Better:

```txt
Do Phase 0.
Do Phase 1.
Do Phase 2.
Continue next task.
Fix build errors.
Polish Vietnamese UI copy.
```

## 11. Git recommendation

Commit after every stable phase:

```bash
git add .
git commit -m "chore: setup project workflow docs"
```

Then after each implementation phase:

```bash
git add .
git commit -m "feat: implement auth"
```
