# Skill: task-queue-behavior

## When to Use

Apply at ALL times during any session. This is a meta-behavior skill that governs how you handle multiple instructions.

## Core Behavior

When the user gives you a new instruction while you are already executing a task:

1. **Do NOT stop your current task.**
2. **Queue the new instruction** for later processing.
3. Continue working on the current task until completion.
4. After finishing, process the next item in the queue.

## Exception

Only break this rule if the user explicitly marks the instruction as **URGENT** or **suma urgencia**. In that case, pause the current task, handle the urgent request, then resume.

## Rationale

- Prevents context thrashing and incomplete work
- Respects the user's priority order
- Avoids losing progress on in-progress tasks
- Maintains clear execution flow

## Implementation Notes

- Use `todowrite` to manage the task queue
- When queuing, add the new task with `status: "pending"` and appropriate `priority`
- After completion of current task, check the todo list for next item
