"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type DragEvent,
  type FormEvent,
  type PointerEvent,
} from "react";

import { AppTopBar } from "@/components/app-top-bar";
import {
  createDefaultTodoLists,
  toggleTodoTask,
  type TodoListRecord,
  type TodoPriority,
  type TodoStatus,
  type TodoTaskRecord,
} from "@/lib/todo-data";

type FilterValue = "all" | TodoStatus;

type EditorState = {
  mode: "create" | "edit";
  listId: string;
  taskId: string | null;
  title: string;
  notes: string;
  status: TodoStatus;
  priority: TodoPriority;
  phase: string;
  dueDate: string;
  tags: string;
};

type TaskRowProps = {
  task: TodoTaskRecord;
  onOpen: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onToggleDone: (taskId: string) => void;
  onDragStart: (taskId: string) => void;
  onDrop: (taskId: string) => void;
};

function PlusIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function GripIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="currentColor"
    >
      <circle cx="8" cy="7" r="1.4" />
      <circle cx="8" cy="12" r="1.4" />
      <circle cx="8" cy="17" r="1.4" />
      <circle cx="16" cy="7" r="1.4" />
      <circle cx="16" cy="12" r="1.4" />
      <circle cx="16" cy="17" r="1.4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 12 4.2 4.2L19 6.8" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 20h4l9.8-9.8a2 2 0 0 0-4-4L4 16v4Z" />
      <path d="m12.5 7.5 4 4" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 7h14" />
      <path d="M9 7V5h6v2" />
      <path d="M8 7v12" />
      <path d="M16 7v12" />
      <path d="M6 7l1 13h10l1-13" />
    </svg>
  );
}

function getStatusLabel(status: TodoStatus) {
  switch (status) {
    case "not_started":
      return "Not Started";
    case "in_progress":
      return "In Progress";
    case "blocked":
      return "Blocked";
    default:
      return "Done";
  }
}

function getStatusDotClass(status: TodoStatus) {
  switch (status) {
    case "done":
      return "bg-[var(--accent-strong)]";
    case "blocked":
      return "bg-[var(--accent-tertiary)]";
    case "in_progress":
      return "bg-[var(--accent)]";
    default:
      return "bg-[var(--ink-muted)]";
  }
}

function getPriorityClass(priority: TodoPriority) {
  switch (priority) {
    case "high":
      return "bg-[rgba(191,95,44,0.12)] text-[var(--accent)]";
    case "low":
      return "bg-[rgba(82,59,40,0.06)] text-[var(--ink-soft)]";
    default:
      return "bg-[rgba(47,118,102,0.1)] text-[var(--accent-strong)]";
  }
}

function parseTags(value: string) {
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function slugifyLabel(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildEditorState(
  mode: "create" | "edit",
  listId: string,
  task?: TodoTaskRecord,
  fallbackPhase?: string,
): EditorState {
  if (task) {
    return {
      mode,
      listId,
      taskId: task.id,
      title: task.title,
      notes: task.notes ?? "",
      status: task.status,
      priority: task.priority,
      phase: task.phase,
      dueDate: task.dueDate ?? "",
      tags: task.tags?.join(", ") ?? "",
    };
  }

  return {
    mode,
    listId,
    taskId: null,
    title: "",
    notes: "",
    status: "not_started",
    priority: "medium",
    phase: fallbackPhase ?? "General",
    dueDate: "",
    tags: "",
  };
}

function TaskRow({
  task,
  onOpen,
  onDelete,
  onToggleDone,
  onDragStart,
  onDrop,
}: TaskRowProps) {
  const [offset, setOffset] = useState(0);
  const [tracking, setTracking] = useState(false);
  const startXRef = useRef<number | null>(null);
  const movedRef = useRef(false);
  const blockTapRef = useRef(false);
  const isDone = task.status === "done";

  function triggerToggle() {
    blockTapRef.current = true;
    setOffset(0);
    onToggleDone(task.id);

    window.setTimeout(() => {
      blockTapRef.current = false;
    }, 140);
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" || isDone) {
      return;
    }

    if ((event.target as HTMLElement).closest("[data-block-swipe='true']")) {
      return;
    }

    startXRef.current = event.clientX;
    movedRef.current = false;
    blockTapRef.current = false;
    setTracking(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (startXRef.current === null) {
      return;
    }

    const delta = Math.max(0, event.clientX - startXRef.current);

    if (delta > 6) {
      movedRef.current = true;
    }

    setOffset(Math.min(delta, 120));
  }

  function handlePointerEnd(event: PointerEvent<HTMLDivElement>) {
    if (startXRef.current === null) {
      return;
    }

    const shouldToggle = offset >= 68;

    startXRef.current = null;
    setTracking(false);

    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {}

    if (shouldToggle) {
      setOffset(120);

      window.setTimeout(() => {
        triggerToggle();
        setOffset(0);
      }, 100);

      return;
    }

    if (movedRef.current) {
      blockTapRef.current = true;

      window.setTimeout(() => {
        blockTapRef.current = false;
      }, 120);
    }

    setOffset(0);
  }

  function handleOpen() {
    if (blockTapRef.current || movedRef.current) {
      movedRef.current = false;
      return;
    }

    onOpen(task.id);
  }

  const rowStyle: CSSProperties = {
    transform: `translateX(${offset}px)`,
    transition: tracking ? "none" : "transform 180ms ease",
    touchAction: "pan-y",
  };

  return (
    <div className="relative overflow-hidden rounded-[18px] sm:rounded-[20px]">
      <div className="absolute inset-0 flex items-center justify-end rounded-[18px] bg-[rgba(47,118,102,0.12)] px-4 sm:rounded-[20px]">
        <span className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[var(--accent-strong)]">
          {isDone ? "reopen" : "done"}
        </span>
      </div>

      <div
        draggable={!isDone}
        onDragStart={(event: DragEvent<HTMLDivElement>) => {
          if (isDone) {
            return;
          }

          event.dataTransfer.effectAllowed = "move";
          onDragStart(task.id);
        }}
        onDragOver={(event: DragEvent<HTMLDivElement>) => {
          if (isDone) {
            return;
          }

          event.preventDefault();
        }}
        onDrop={(event: DragEvent<HTMLDivElement>) => {
          event.preventDefault();
          onDrop(task.id);
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        style={rowStyle}
        className={`relative z-10 flex items-start gap-2 rounded-[18px] border border-[var(--panel-line)] bg-[var(--panel-strong)] px-2.5 py-2.5 shadow-[0_6px_16px_rgba(101,73,47,0.04)] sm:gap-3 sm:rounded-[20px] sm:px-3 sm:py-3 ${
          isDone ? "opacity-75" : ""
        }`}
      >
        <button
          type="button"
          data-block-swipe="true"
          onClick={triggerToggle}
          className={`mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[14px] border transition sm:h-10 sm:w-10 sm:rounded-[16px] ${
            isDone
              ? "border-[rgba(47,118,102,0.12)] bg-[rgba(47,118,102,0.12)] text-[var(--accent-strong)]"
              : "border-[rgba(47,118,102,0.16)] bg-[rgba(47,118,102,0.08)] text-[var(--accent-strong)] hover:border-[rgba(47,118,102,0.24)] hover:bg-[rgba(47,118,102,0.14)]"
          }`}
          aria-label={isDone ? `Reopen ${task.title}` : `Mark ${task.title} done`}
        >
          {isDone ? (
            <CheckIcon />
          ) : (
            <span className="inline-flex h-3.5 w-3.5 rounded-full border-2 border-current" />
          )}
        </button>

        <button
          type="button"
          onClick={handleOpen}
          className="min-w-0 flex-1 text-left"
        >
          <span className="flex min-w-0 items-start gap-2">
            <span
              className={`mt-1.5 inline-flex h-2.5 w-2.5 shrink-0 rounded-full ${getStatusDotClass(task.status)}`}
            />

            <span className="min-w-0 flex-1">
              <span className="flex items-start gap-2">
                <span
                  className={`min-w-0 flex-1 whitespace-normal break-words text-[0.98rem] font-semibold leading-5 text-[var(--ink)] sm:text-base ${
                    isDone ? "line-through decoration-[1.5px]" : ""
                  }`}
                >
                  {task.title}
                </span>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.14em] sm:px-2.5 sm:py-1 sm:text-[0.68rem] ${getPriorityClass(task.priority)}`}
                >
                  {task.priority}
                </span>
              </span>

              <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.72rem] font-medium text-[var(--ink-muted)] sm:text-[0.76rem]">
                <span>{getStatusLabel(task.status)}</span>
                {task.dueDate ? (
                  <span className="rounded-full bg-[rgba(82,59,40,0.04)] px-2 py-0.5">
                    {task.dueDate}
                  </span>
                ) : null}
                {task.tags?.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[rgba(47,118,102,0.08)] px-2 py-0.5 text-[var(--accent-strong)]"
                  >
                    #{tag}
                  </span>
                ))}
              </span>

              {task.notes ? (
                <span className="mt-1 block truncate text-[0.78rem] leading-5 text-[var(--ink-muted)] sm:text-sm">
                  {task.notes}
                </span>
              ) : null}
            </span>
          </span>
        </button>

        <div className="flex shrink-0 items-start gap-1">
          <span className="hidden h-8 w-8 items-center justify-center rounded-[12px] border border-[rgba(82,59,40,0.06)] bg-white/55 text-[var(--ink-muted)] sm:inline-flex">
            <GripIcon />
          </span>

          <button
            type="button"
            data-block-swipe="true"
            onClick={() => onOpen(task.id)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-[12px] border border-[rgba(82,59,40,0.08)] bg-white/65 text-[var(--ink-soft)] transition hover:border-[rgba(191,95,44,0.18)] hover:text-[var(--accent)] sm:h-9 sm:w-9"
            aria-label={`Edit ${task.title}`}
          >
            <EditIcon />
          </button>

          <button
            type="button"
            data-block-swipe="true"
            onClick={() => onDelete(task.id)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-[12px] border border-[rgba(82,59,40,0.08)] bg-white/65 text-[var(--ink-soft)] transition hover:border-[rgba(191,95,44,0.18)] hover:text-[var(--accent)] sm:h-9 sm:w-9"
            aria-label={`Delete ${task.title}`}
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

export function TodoWorkspace({
  initialSelectedTaskId,
}: {
  initialSelectedTaskId?: string;
}) {
  const [lists, setLists] = useState<TodoListRecord[]>(createDefaultTodoLists);
  const [activeListId, setActiveListId] = useState<string>(() => {
    const seeded = createDefaultTodoLists();

    if (!initialSelectedTaskId) {
      return seeded[0]?.id ?? "";
    }

    const located = seeded.find((list) =>
      list.tasks.some((task) => task.id === initialSelectedTaskId),
    );

    return located?.id ?? seeded[0]?.id ?? "";
  });
  const [filter, setFilter] = useState<FilterValue>("all");
  const [editor, setEditor] = useState<EditorState | null>(() => {
    if (!initialSelectedTaskId) {
      return null;
    }

    const seeded = createDefaultTodoLists();
    const located = seeded.find((list) =>
      list.tasks.some((task) => task.id === initialSelectedTaskId),
    );
    const task = located?.tasks.find((entry) => entry.id === initialSelectedTaskId);

    if (!located || !task) {
      return null;
    }

    return buildEditorState("edit", located.id, task);
  });
  const [creatingList, setCreatingList] = useState(false);
  const [draftListName, setDraftListName] = useState("");
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const activeList =
    lists.find((list) => list.id === activeListId) ?? lists[0] ?? null;

  const sortedTasks = useMemo(
    () => [...(activeList?.tasks ?? [])].sort((left, right) => left.order - right.order),
    [activeList],
  );
  const filteredTasks = useMemo(
    () =>
      sortedTasks.filter((task) => (filter === "all" ? true : task.status === filter)),
    [filter, sortedTasks],
  );
  const groupedTasks = useMemo(() => {
    const groups: Array<{ phase: string; tasks: TodoTaskRecord[] }> = [];

    for (const task of filteredTasks) {
      const currentGroup = groups.find((group) => group.phase === task.phase);

      if (!currentGroup) {
        groups.push({
          phase: task.phase,
          tasks: [task],
        });
        continue;
      }

      currentGroup.tasks.push(task);
    }

    return groups;
  }, [filteredTasks]);

  const totalTasks = activeList?.tasks.length ?? 0;
  const doneTasks =
    activeList?.tasks.filter((task) => task.status === "done").length ?? 0;
  const progressPercent =
    totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  useEffect(() => {
    if (!editor && !creatingList) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") {
        return;
      }

      setEditor(null);
      setCreatingList(false);
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [editor, creatingList]);

  function openTask(taskId: string) {
    const located = lists.find((list) => list.tasks.some((task) => task.id === taskId));
    const task = located?.tasks.find((entry) => entry.id === taskId);

    if (!located || !task) {
      return;
    }

    setActiveListId(located.id);
    setEditor(buildEditorState("edit", located.id, task));
  }

  function openCreateTask() {
    const fallbackList = activeList ?? lists[0];

    if (!fallbackList) {
      return;
    }

    const fallbackPhase = fallbackList.tasks[0]?.phase ?? fallbackList.name;
    setEditor(buildEditorState("create", fallbackList.id, undefined, fallbackPhase));
  }

  function updateEditor<Field extends keyof EditorState>(
    field: Field,
    value: EditorState[Field],
  ) {
    setEditor((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        [field]: value,
      };
    });
  }

  function handleCreateList(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextName = draftListName.trim();

    if (!nextName) {
      return;
    }

    const nextListId = `${slugifyLabel(nextName) || "list"}-${Date.now()}`;

    setLists((current) => [
      ...current,
      {
        id: nextListId,
        name: nextName,
        tasks: [],
      },
    ]);
    setActiveListId(nextListId);
    setFilter("all");
    setDraftListName("");
    setCreatingList(false);
  }

  function handleDeleteTask(taskId: string) {
    setLists((current) =>
      current.map((list) => ({
        ...list,
        tasks: list.tasks.filter((task) => task.id !== taskId),
      })),
    );
    setDraggedTaskId((current) => (current === taskId ? null : current));
    setEditor((current) => (current?.taskId === taskId ? null : current));
  }

  function handleToggleDone(taskId: string) {
    setLists((current) =>
      current.map((list) => {
        if (!list.tasks.some((task) => task.id === taskId)) {
          return list;
        }

        const updatedTasks = list.tasks.map((task) =>
          task.id === taskId ? toggleTodoTask(task) : { ...task },
        );
        const targetTask = updatedTasks.find((task) => task.id === taskId);

        if (!targetTask) {
          return list;
        }

        const withoutTarget = updatedTasks.filter((task) => task.id !== taskId);
        const reinserted =
          targetTask.status === "done"
            ? [...withoutTarget, targetTask]
            : [targetTask, ...withoutTarget];

        return {
          ...list,
          tasks: reinserted.map((task, index) => ({
            ...task,
            order: index + 1,
          })),
        };
      }),
    );

    setEditor((current) => {
      if (!current?.taskId || current.taskId !== taskId) {
        return current;
      }

      return {
        ...current,
        status: current.status === "done" ? "not_started" : "done",
      };
    });
  }

  function handleReorder(targetTaskId: string) {
    if (!draggedTaskId || draggedTaskId === targetTaskId || !activeList) {
      setDraggedTaskId(null);
      return;
    }

    setLists((current) =>
      current.map((list) => {
        if (list.id !== activeList.id) {
          return list;
        }

        const fromIndex = list.tasks.findIndex((task) => task.id === draggedTaskId);
        const targetIndex = list.tasks.findIndex((task) => task.id === targetTaskId);

        if (fromIndex < 0 || targetIndex < 0) {
          return list;
        }

        const reordered = [...list.tasks];
        const [movedTask] = reordered.splice(fromIndex, 1);
        reordered.splice(targetIndex, 0, movedTask);

        return {
          ...list,
          tasks: reordered.map((task, index) => ({
            ...task,
            order: index + 1,
          })),
        };
      }),
    );
    setDraggedTaskId(null);
  }

  function handleSaveTask() {
    if (!editor) {
      return;
    }

    const nextTitle = editor.title.trim();

    if (!nextTitle) {
      return;
    }

    setLists((current) => {
      const strippedLists = current.map((list) => {
        if (!editor.taskId) {
          return {
            ...list,
            tasks: [...list.tasks],
          };
        }

        return {
          ...list,
          tasks: list.tasks.filter((task) => task.id !== editor.taskId),
        };
      });

      const targetIndex = strippedLists.findIndex((list) => list.id === editor.listId);

      if (targetIndex < 0) {
        return current;
      }

      const targetList = strippedLists[targetIndex];
      const existingTask = current
        .flatMap((list) => list.tasks)
        .find((task) => task.id === editor.taskId);
      const nextTask: TodoTaskRecord = {
        id: editor.taskId ?? `task-${Date.now()}`,
        title: nextTitle,
        notes: editor.notes.trim() || null,
        status: editor.status,
        priority: editor.priority,
        phase: editor.phase.trim() || "General",
        dueDate: editor.dueDate.trim() || null,
        order:
          editor.status === "done"
            ? targetList.tasks.length + 1
            : 1,
        tags: parseTags(editor.tags),
        resumeStatus:
          editor.status === "done"
            ? existingTask?.resumeStatus ?? "not_started"
            : editor.status,
        comments: existingTask?.comments.map((comment) => ({ ...comment })) ?? [],
      };

      const insertAtEnd = nextTask.status === "done";
      const nextTasks = insertAtEnd
        ? [...targetList.tasks, nextTask]
        : [nextTask, ...targetList.tasks];

      strippedLists[targetIndex] = {
        ...targetList,
        tasks: nextTasks.map((task, index) => ({
          ...task,
          order: index + 1,
        })),
      };

      return strippedLists;
    });

    setActiveListId(editor.listId);
    setEditor(null);
  }

  return (
    <div className="min-h-screen pb-10">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
        <AppTopBar
          activeHref="/tasks"
          detailText={`${activeList?.name ?? "Lists"} - ${doneTasks}/${totalTasks} done`}
          actions={
            <button
              type="button"
              onClick={openCreateTask}
              className="launch-chip h-11 w-11"
              aria-label="Add a new task"
            >
              <PlusIcon />
            </button>
          }
        />

        <section className="space-y-4">
          <div className="rounded-[22px] border border-[var(--panel-line)] bg-[var(--panel-strong)] px-3 py-3 shadow-[0_8px_18px_rgba(101,73,47,0.05)] sm:rounded-[28px] sm:p-4">
            <div className="flex items-center gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[var(--ink-muted)]">
                  Progress
                </p>
                <p className="mt-1 text-sm font-semibold text-[var(--ink)] sm:mt-2 sm:text-2xl">
                  {doneTasks}/{totalTasks} complete
                </p>
              </div>

              <div className="min-w-0 flex-1 sm:max-w-[320px]">
                <div className="flex items-center justify-between text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[var(--panel-muted)]">
                  <span>{progressPercent}%</span>
                  <span>{totalTasks} total</span>
                </div>
                <div className="mt-1.5 h-2 rounded-full bg-[rgba(82,59,40,0.06)] sm:mt-2 sm:h-3">
                  <div
                    className="h-2 rounded-full bg-[var(--accent)] transition-all duration-200 sm:h-3"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto pb-1">
            <div className="flex min-w-max items-center gap-2">
              {lists.map((list) => {
                const selected = list.id === activeList?.id;
                const openCount = list.tasks.filter((task) => task.status !== "done").length;

                return (
                  <button
                    key={list.id}
                    type="button"
                    onClick={() => {
                      setActiveListId(list.id);
                      setFilter("all");
                    }}
                    className={`rounded-full border px-3 py-1.5 text-[0.82rem] font-semibold transition sm:px-4 sm:py-2 sm:text-sm ${
                      selected
                        ? "border-[rgba(191,95,44,0.18)] bg-[rgba(191,95,44,0.12)] text-[var(--accent)]"
                        : "border-[rgba(82,59,40,0.08)] bg-white/65 text-[var(--ink-soft)]"
                    }`}
                  >
                    {list.name}{" "}
                    <span className="text-[0.8em] text-[var(--ink-muted)]">
                      {openCount}
                    </span>
                  </button>
                );
              })}

              {creatingList ? (
                <form
                  onSubmit={handleCreateList}
                  className="flex items-center gap-2 rounded-full border border-[rgba(82,59,40,0.08)] bg-white/70 px-2 py-1.5"
                >
                  <input
                    value={draftListName}
                    onChange={(event) => setDraftListName(event.target.value)}
                    placeholder="New list"
                    className="w-28 border-0 bg-transparent px-2 text-sm font-medium text-[var(--ink)] outline-none placeholder:text-[var(--ink-muted)]"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="rounded-full bg-[rgba(191,95,44,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]"
                  >
                    Add
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setCreatingList(true)}
                  className="rounded-full border border-dashed border-[rgba(82,59,40,0.14)] px-3 py-1.5 text-[0.82rem] font-semibold text-[var(--ink-soft)] transition hover:border-[rgba(191,95,44,0.18)] hover:text-[var(--accent)] sm:px-4 sm:py-2 sm:text-sm"
                >
                  New List
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto pb-1">
            <div className="flex min-w-max items-center gap-2">
              {(["all", "not_started", "in_progress", "blocked", "done"] as const).map(
                (value) => {
                  const active = filter === value;
                  const label = value === "all" ? "All" : getStatusLabel(value);

                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFilter(value)}
                      className={`rounded-full border px-3 py-1.5 text-[0.82rem] font-semibold transition sm:px-4 sm:py-2 sm:text-sm ${
                        active
                          ? "border-[rgba(47,118,102,0.18)] bg-[rgba(47,118,102,0.1)] text-[var(--accent-strong)]"
                          : "border-[rgba(82,59,40,0.08)] bg-white/65 text-[var(--ink-soft)]"
                      }`}
                    >
                      {label}
                    </button>
                  );
                },
              )}
            </div>
          </div>

          <div className="space-y-5">
            {groupedTasks.map((group) => {
              const phaseTotal = activeList?.tasks.filter(
                (task) => task.phase === group.phase,
              ).length ?? 0;
              const phaseDone = activeList?.tasks.filter(
                (task) => task.phase === group.phase && task.status === "done",
              ).length ?? 0;
              const phasePercent =
                phaseTotal > 0 ? Math.round((phaseDone / phaseTotal) * 100) : 0;

              return (
                <div
                  key={group.phase}
                  className="rounded-[22px] border border-[var(--panel-line)] bg-[var(--panel-strong)] p-3 shadow-[0_8px_18px_rgba(101,73,47,0.05)] sm:rounded-[28px] sm:p-4"
                >
                  <div className="flex flex-col gap-2 border-b border-[var(--line-soft)] pb-3 sm:flex-row sm:items-end sm:justify-between sm:gap-3 sm:pb-4">
                    <div>
                      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[var(--ink-muted)]">
                        Phase
                      </p>
                      <h2 className="mt-1 text-lg font-semibold text-[var(--ink)] sm:mt-2 sm:text-xl">
                        {group.phase}
                      </h2>
                    </div>

                    <div className="w-full max-w-[240px]">
                      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink-muted)]">
                        <span>
                          {phaseDone}/{phaseTotal} done
                        </span>
                        <span>{phasePercent}%</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-[rgba(82,59,40,0.06)]">
                        <div
                          className="h-2 rounded-full bg-[var(--accent-strong)]"
                          style={{ width: `${phasePercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 space-y-2.5 sm:mt-4 sm:space-y-3">
                    {group.tasks.map((task) => (
                      <TaskRow
                        key={task.id}
                        task={task}
                        onOpen={openTask}
                        onDelete={handleDeleteTask}
                        onToggleDone={handleToggleDone}
                        onDragStart={setDraggedTaskId}
                        onDrop={handleReorder}
                      />
                    ))}
                  </div>
                </div>
              );
            })}

            {groupedTasks.length === 0 ? (
              <div className="rounded-[28px] border border-dashed border-[rgba(82,59,40,0.14)] bg-white/45 px-5 py-10 text-center">
                <p className="text-base font-semibold text-[var(--ink)]">
                  No tasks match this filter.
                </p>
                <p className="mt-2 text-sm text-[var(--ink-muted)]">
                  Change the filter or add a new task.
                </p>
              </div>
            ) : null}
          </div>
        </section>
      </div>

      {editor ? (
        <div
          className="fixed inset-0 z-40 bg-[rgba(47,33,24,0.24)] p-3 sm:p-6"
          onClick={() => setEditor(null)}
        >
          <div
            className="absolute inset-x-0 bottom-0 max-h-[92vh] overflow-y-auto rounded-t-[28px] border border-[var(--panel-line)] bg-[var(--panel-strong)] px-4 pb-6 pt-4 shadow-[0_-18px_32px_rgba(47,33,24,0.12)] sm:left-auto sm:right-6 sm:top-6 sm:w-[460px] sm:rounded-[32px] sm:px-5"
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[var(--ink-muted)]">
                  {editor.mode === "create" ? "New task" : "Task details"}
                </p>
                <p className="mt-1 text-sm font-medium text-[var(--ink-soft)]">
                  Launch-ready task details with simple fields.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditor(null)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(82,59,40,0.08)] bg-white/60 text-lg leading-none text-[var(--ink-soft)]"
                aria-label="Close task details"
              >
                x
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--ink-muted)]">
                  Title
                </span>
                <input
                  value={editor.title}
                  onChange={(event) => updateEditor("title", event.target.value)}
                  placeholder="What needs to happen?"
                  className="w-full rounded-[20px] border border-[rgba(82,59,40,0.08)] bg-white/70 px-4 py-3 text-base font-medium text-[var(--ink)] outline-none placeholder:text-[var(--ink-muted)]"
                  autoFocus
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--ink-muted)]">
                  Notes
                </span>
                <textarea
                  value={editor.notes}
                  onChange={(event) => updateEditor("notes", event.target.value)}
                  placeholder="Optional notes"
                  rows={4}
                  className="w-full rounded-[20px] border border-[rgba(82,59,40,0.08)] bg-white/70 px-4 py-3 text-sm leading-7 text-[var(--ink)] outline-none placeholder:text-[var(--ink-muted)]"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--ink-muted)]">
                    List
                  </span>
                  <select
                    value={editor.listId}
                    onChange={(event) => updateEditor("listId", event.target.value)}
                    className="w-full rounded-[20px] border border-[rgba(82,59,40,0.08)] bg-white/70 px-4 py-3 text-sm font-medium text-[var(--ink)] outline-none"
                  >
                    {lists.map((list) => (
                      <option key={list.id} value={list.id}>
                        {list.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--ink-muted)]">
                    Phase
                  </span>
                  <input
                    value={editor.phase}
                    onChange={(event) => updateEditor("phase", event.target.value)}
                    placeholder="Phase name"
                    className="w-full rounded-[20px] border border-[rgba(82,59,40,0.08)] bg-white/70 px-4 py-3 text-sm font-medium text-[var(--ink)] outline-none placeholder:text-[var(--ink-muted)]"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <label className="block">
                  <span className="mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--ink-muted)]">
                    Status
                  </span>
                  <select
                    value={editor.status}
                    onChange={(event) =>
                      updateEditor("status", event.target.value as TodoStatus)
                    }
                    className="w-full rounded-[20px] border border-[rgba(82,59,40,0.08)] bg-white/70 px-4 py-3 text-sm font-medium text-[var(--ink)] outline-none"
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="blocked">Blocked</option>
                    <option value="done">Done</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--ink-muted)]">
                    Priority
                  </span>
                  <select
                    value={editor.priority}
                    onChange={(event) =>
                      updateEditor("priority", event.target.value as TodoPriority)
                    }
                    className="w-full rounded-[20px] border border-[rgba(82,59,40,0.08)] bg-white/70 px-4 py-3 text-sm font-medium text-[var(--ink)] outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--ink-muted)]">
                    Due date
                  </span>
                  <input
                    value={editor.dueDate}
                    onChange={(event) => updateEditor("dueDate", event.target.value)}
                    placeholder="Optional"
                    className="w-full rounded-[20px] border border-[rgba(82,59,40,0.08)] bg-white/70 px-4 py-3 text-sm font-medium text-[var(--ink)] outline-none placeholder:text-[var(--ink-muted)]"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--ink-muted)]">
                  Tags
                </span>
                <input
                  value={editor.tags}
                  onChange={(event) => updateEditor("tags", event.target.value)}
                  placeholder="Comma-separated tags"
                  className="w-full rounded-[20px] border border-[rgba(82,59,40,0.08)] bg-white/70 px-4 py-3 text-sm font-medium text-[var(--ink)] outline-none placeholder:text-[var(--ink-muted)]"
                />
              </label>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              {editor.mode === "edit" && editor.taskId ? (
                <button
                  type="button"
                  onClick={() => handleDeleteTask(editor.taskId!)}
                  className="rounded-full border border-[rgba(82,59,40,0.08)] px-4 py-2 text-sm font-semibold text-[var(--ink-soft)]"
                >
                  Remove
                </button>
              ) : null}

              {editor.mode === "edit" && editor.taskId ? (
                <button
                  type="button"
                  onClick={() => {
                    handleToggleDone(editor.taskId!);
                    setEditor(null);
                  }}
                  className="rounded-full border border-[rgba(47,118,102,0.18)] bg-[rgba(47,118,102,0.1)] px-4 py-2 text-sm font-semibold text-[var(--accent-strong)]"
                >
                  {editor.status === "done" ? "Reopen" : "Mark Done"}
                </button>
              ) : null}

              <button
                type="button"
                onClick={handleSaveTask}
                className="ml-auto rounded-full border border-[rgba(191,95,44,0.18)] bg-[rgba(191,95,44,0.12)] px-5 py-2.5 text-sm font-semibold text-[var(--accent)]"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
