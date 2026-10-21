# Frame by Frame — Implementation Journal

> **For agentic workers:** This is the only journal. When a task in `docs/implementation-plan.md` has passed its verify step, append one entry under `## Entries`, then commit that entry with the task. Reviewers use this file as the record of what shipped and which choices were not already in the plan.

**Status:** empty. No task has been implemented.

Do not rewrite this header. Do not edit another task's entry. Do not add a status table — reviewers compare the headings under `## Entries` with the list below.

## Rules

1. Write the entry only after that task's verify step has passed.
2. Re-read this file immediately before appending. Another agent may have written since you started.
3. Add the entry at the bottom of `## Entries`. Leave every earlier entry untouched, including wording you disagree with.
4. The heading is `### Task N: <title>` copied from the plan. One entry per task. If that heading already exists, stop and do not write a second one.
5. Flag every engineering decision with a bullet whose line starts with `**Decision:**`. A decision is a choice the plan did not already make, or a choice that departs from the plan, `docs/prd.md`, or `docs/design-system.md`. Carrying out a specified step is not a decision and does not get a flag.
6. When nothing was decided beyond the plan, the decisions section is exactly one bullet: `**Decision:** none. Implemented as specified.`
7. A departure from a specified step adds `**Deviation:**` on that same decision and quotes the step. Reviewers search for `**Deviation:**`.
8. The entry ships in the task commit. The plan's commit step lists this file in `git add`.
9. Writes are serial. Subagent-driven execution reviews between tasks, so the next task starts after the previous entry is committed. If two tasks would finish together, the parent appends one entry, commits, then the next. Two writers appending at once will drop an entry.

## Entry template

Copy this shape. Replace every angle-bracket field. Delete no labelled line; write `none` when a section is empty.

```markdown
### Task N: <title copied from the plan>

- **Status:** complete
- **When:** <YYYY-MM-DD>
- **Plan reference:** `docs/implementation-plan.md` → Task N

#### Shipped

- `<path>` — <behavior a reviewer can check against the plan's Files and Interfaces>

#### Verified

- `<command from the plan's verify step>` → <actual result: pass count, exit code, or what you saw>

#### Decisions

- **Decision:** none. Implemented as specified.

or, for each real choice:

- **Decision:** <what was chosen, in one sentence>.
  - **Because:** <the constraint, measurement, or spec line that forced it>.
  - **Rejected:** <the alternative that was actually considered, and why it lost>.
  - **Risk:** <what the reviewer should re-check>. If there is nothing to re-check, write `none`.
  - **Deviation:** no

  A departure from a specified step uses `**Deviation:**` yes, then quotes the plan step on the next line:
  - **Deviation:** yes. Plan step: "<quoted step>". Did this instead: <what landed>.

#### Left open

- none
```

What counts as a decision, so the flag stays meaningful:

- A library, version, file split, or API shape the plan left unspecified.
- A behavior the tests forced that the plan did not describe.
- A specified step you did not follow.
- An alternative you implemented far enough to reject.

What does not count:

- Restating the plan in past tense.
- Formatting, rename-only cleanups, or choices the plan already named.

## Required entries

Reviewers check that `## Entries` contains each heading once, in this order. Implementers do not edit this list.

1. `### Task 1: Scaffold and toolchain`
2. `### Task 2: Design tokens, theme, and grain`
3. `### Task 3: Content types and build-time validation`
4. `### Task 4: Port the resource ledger`
5. `### Task 5: Port the curriculum, gaps, tools, and capstone stages`
6. `### Task 6: Progress engine`
7. `### Task 7: Week derivation`
8. `### Task 8: App shell and navigation`
9. `### Task 9: Filmstrip components`
10. `### Task 10: /plan`
11. `### Task 11: /week/:n`
12. `### Task 12: Library search and filter logic`
13. `### Task 13: /library UI`
14. `### Task 14: Dashboard, landing, capstone, toolkit, about`
15. `### Task 15: Static atmosphere`
16. `### Task 16: Vendored canvas layer and guards`
17. `### Task 17: Hardening and release gates`

## How to review from this file

1. Match the headings under `## Entries` to the required list. A missing heading means that task was not journaled, so the review has no decision record for it.
2. Search `**Decision:**`. Read every hit. `none. Implemented as specified.` means you judge the diff against the plan with no claimed exception.
3. Search `**Deviation:**`. Each `yes` is a plan step the implementer did not follow. Those are the review gates.
4. Check **Verified** against the verify step in the plan. A missing command means the task is incomplete, even when the code exists.
5. Read **Left open** before the next task starts. Those items are inherited risk, not notes to ignore.

## Entries

Append below this line.
