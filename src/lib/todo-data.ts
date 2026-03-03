import { tasks as legacyTasks, type TaskCommentRecord } from "./app-data";

export type TodoStatus = "not_started" | "in_progress" | "blocked" | "done";
export type TodoPriority = "low" | "medium" | "high";
export type ActiveTodoStatus = Exclude<TodoStatus, "done">;

export type TodoTaskRecord = {
  id: string;
  title: string;
  notes: string | null;
  status: TodoStatus;
  priority: TodoPriority;
  phase: string;
  dueDate: string | null;
  order: number;
  tags?: string[];
  resumeStatus: ActiveTodoStatus;
  comments: TaskCommentRecord[];
};

export type TodoListRecord = {
  id: string;
  name: string;
  tasks: TodoTaskRecord[];
};

type SeedTaskDefinition = {
  id: string;
  title: string;
  priority: TodoPriority;
  phase: string;
  tags?: string[];
};

const LAUNCH_LIST_NAME = "Launch List";

const launchTaskDefinitions: SeedTaskDefinition[] = [
  {
    id: "launch-01",
    title:
      "Public Health Dept Application (identify correct department + required attachments)",
    priority: "high",
    phase: "Licensing + Public Health",
    tags: ["health"],
  },
  {
    id: "launch-02",
    title: "Submit Mobile Food Service License Application",
    priority: "high",
    phase: "Licensing + Public Health",
    tags: ["health"],
  },
  {
    id: "launch-03",
    title:
      "Schedule Public Health inspection (or next required step after submission)",
    priority: "high",
    phase: "Licensing + Public Health",
    tags: ["health"],
  },
  {
    id: "launch-04",
    title: "Pass inspection + receive approval to operate (milestone)",
    priority: "high",
    phase: "Licensing + Public Health",
    tags: ["health"],
  },
  {
    id: "launch-05",
    title:
      "Assess placement and needs from commissary kitchen (storage, water fill, waste dump, cleaning)",
    priority: "high",
    phase: "Commissary + Operating Plan",
    tags: ["commissary", "ops"],
  },
  {
    id: "launch-06",
    title: "Finalize commissary agreement/letter for health department",
    priority: "high",
    phase: "Commissary + Operating Plan",
    tags: ["commissary", "health"],
  },
  {
    id: "launch-07",
    title: "Purchase espresso machine",
    priority: "high",
    phase: "Equipment Purchases (Core)",
    tags: ["equipment"],
  },
  {
    id: "launch-08",
    title: "Purchase grinder",
    priority: "high",
    phase: "Equipment Purchases (Core)",
    tags: ["equipment"],
  },
  {
    id: "launch-09",
    title:
      "Confirm all required smallwares + basic supplies list (cups, lids, cleaning/sanitizing basics)",
    priority: "medium",
    phase: "Equipment Purchases (Core)",
    tags: ["supplies"],
  },
  {
    id: "launch-10",
    title:
      "Plumbing needs reviewed and assessed (fresh/waste, sink compliance, hot water capability)",
    priority: "high",
    phase: "Trailer Readiness (High-Level Assessments)",
    tags: ["plumbing"],
  },
  {
    id: "launch-11",
    title:
      "Electrical needs reviewed and assessed (including 220V considerations at home + farm)",
    priority: "high",
    phase: "Trailer Readiness (High-Level Assessments)",
    tags: ["electrical"],
  },
  {
    id: "launch-12",
    title:
      "Confirm farm hookup + final operating location plan (power/water/waste access confirmed at a high level)",
    priority: "high",
    phase: "Trailer Readiness (High-Level Assessments)",
    tags: ["location"],
  },
  {
    id: "launch-13",
    title:
      "Meet Paul (coffee roaster) in Chesterland (beans, lineup, ordering cadence, launch timing)",
    priority: "high",
    phase: "Coffee Program",
    tags: ["coffee", "meeting"],
  },
  {
    id: "launch-14",
    title: "Finalize initial menu (drinks only) and pricing (high level)",
    priority: "medium",
    phase: "Coffee Program",
    tags: ["menu"],
  },
  {
    id: "launch-15",
    title: "ServSafe (confirm required type + complete + store certificate)",
    priority: "high",
    phase: "Compliance + Risk",
    tags: ["training", "health"],
  },
  {
    id: "launch-16",
    title: "Purchase General Liability Insurance (mobile coffee trailer)",
    priority: "high",
    phase: "Compliance + Risk",
    tags: ["insurance"],
  },
  {
    id: "launch-17",
    title: "Finalize business credit card signup",
    priority: "medium",
    phase: "Money + Payments",
    tags: ["finance"],
  },
  {
    id: "launch-18",
    title: "Confirm POS/payment processing is ready to take payments (milestone)",
    priority: "high",
    phase: "Money + Payments",
    tags: ["payments"],
  },
  {
    id: "launch-19",
    title:
      "Assess outside design and plan (signage, look/feel, any required decals)",
    priority: "medium",
    phase: "Branding + Exterior",
    tags: ["branding"],
  },
  {
    id: "launch-20",
    title: "Exterior signage installed (milestone)",
    priority: "medium",
    phase: "Branding + Exterior",
    tags: ["branding"],
  },
  {
    id: "launch-21",
    title:
      'Run a full "soft open" service test (workflow, timing, quality) (milestone)',
    priority: "high",
    phase: "Launch",
    tags: ["ops", "test"],
  },
  {
    id: "launch-22",
    title: "Open for business (first official service day) (milestone)",
    priority: "high",
    phase: "Launch",
    tags: ["launch"],
  },
];

function cloneComments(comments: TaskCommentRecord[]) {
  return comments.map((comment) => ({ ...comment }));
}

function cloneTask(task: TodoTaskRecord): TodoTaskRecord {
  return {
    ...task,
    tags: task.tags ? [...task.tags] : undefined,
    comments: cloneComments(task.comments),
  };
}

function cloneList(list: TodoListRecord): TodoListRecord {
  return {
    ...list,
    tasks: list.tasks.map(cloneTask),
  };
}

function mapLegacyStatus(
  status: (typeof legacyTasks)[number]["status"],
): TodoStatus {
  switch (status) {
    case "completed":
      return "done";
    case "blocked":
      return "blocked";
    case "in_progress":
      return "in_progress";
    default:
      return "not_started";
  }
}

function mapLegacyPriority(
  priority: (typeof legacyTasks)[number]["priority"],
): TodoPriority {
  switch (priority) {
    case "urgent":
    case "high":
      return "high";
    case "low":
      return "low";
    default:
      return "medium";
  }
}

function toResumeStatus(status: TodoStatus): ActiveTodoStatus {
  return status === "done" ? "not_started" : status;
}

function buildLegacyList(
  id: string,
  name: string,
  items: typeof legacyTasks,
): TodoListRecord {
  return {
    id,
    name,
    tasks: items.map((task, index) => {
      const status = mapLegacyStatus(task.status);

      return {
        id: task.id,
        title: task.title,
        notes: task.summary,
        status,
        priority: mapLegacyPriority(task.priority),
        phase: task.location,
        dueDate: task.dueLabel,
        order: index + 1,
        tags: undefined,
        resumeStatus: toResumeStatus(status),
        comments: cloneComments(task.comments),
      };
    }),
  };
}

function buildSeedTask(
  definition: SeedTaskDefinition,
  order: number,
): TodoTaskRecord {
  return {
    id: definition.id,
    title: definition.title,
    notes: null,
    status: "not_started",
    priority: definition.priority,
    phase: definition.phase,
    dueDate: null,
    order,
    tags: definition.tags ? [...definition.tags] : undefined,
    resumeStatus: "not_started",
    comments: [],
  };
}

function buildLaunchList(): TodoListRecord {
  return {
    id: "launch-list",
    name: LAUNCH_LIST_NAME,
    tasks: launchTaskDefinitions.map((definition, index) =>
      buildSeedTask(definition, index + 1),
    ),
  };
}

function mergeSeededTask(
  seededTask: TodoTaskRecord,
  existingTask?: TodoTaskRecord,
): TodoTaskRecord {
  if (!existingTask) {
    return cloneTask(seededTask);
  }

  const preservedStatus = existingTask.status;
  const preservedResumeStatus =
    preservedStatus === "done"
      ? existingTask.resumeStatus
      : toResumeStatus(preservedStatus);

  return {
    ...seededTask,
    notes: existingTask.notes,
    status: preservedStatus,
    dueDate: existingTask.dueDate,
    tags:
      existingTask.tags && existingTask.tags.length > 0
        ? [...existingTask.tags]
        : seededTask.tags
          ? [...seededTask.tags]
          : undefined,
    resumeStatus: preservedResumeStatus,
    comments: cloneComments(existingTask.comments),
  };
}

export function seedLaunchList(existingLists: TodoListRecord[]) {
  const seedList = buildLaunchList();
  const launchListIndex = existingLists.findIndex(
    (list) => list.name === LAUNCH_LIST_NAME,
  );

  if (launchListIndex < 0) {
    return [...existingLists.map(cloneList), seedList];
  }

  const currentLists = existingLists.map(cloneList);
  const currentLaunchList = currentLists[launchListIndex];
  const matchedTasks = new Map<string, TodoTaskRecord>();

  for (const task of currentLaunchList.tasks) {
    matchedTasks.set(task.id, task);
    matchedTasks.set(task.title, task);
  }

  const nextTasks = seedList.tasks.map((seededTask, index) => {
    const match =
      matchedTasks.get(seededTask.id) ?? matchedTasks.get(seededTask.title);

    return {
      ...mergeSeededTask(seededTask, match),
      order: index + 1,
    };
  });

  currentLists[launchListIndex] = {
    ...currentLaunchList,
    id: seedList.id,
    name: LAUNCH_LIST_NAME,
    tasks: nextTasks,
  };

  return currentLists;
}

export function createDefaultTodoLists() {
  const baseLists: TodoListRecord[] = [
    buildLegacyList("daily-flow", "Daily Flow", legacyTasks.slice(0, 2)),
    buildLegacyList("next-up", "Next Up", legacyTasks.slice(2)),
  ];

  return seedLaunchList(baseLists);
}

export function findSeededTodoTask(taskId: string) {
  return createDefaultTodoLists()
    .flatMap((list) => list.tasks)
    .find((task) => task.id === taskId);
}

export function toggleTodoTask(task: TodoTaskRecord): TodoTaskRecord {
  if (task.status === "done") {
    const reopenedStatus = task.resumeStatus ?? "not_started";

    return {
      ...cloneTask(task),
      status: reopenedStatus,
      resumeStatus: reopenedStatus,
    };
  }

  return {
    ...cloneTask(task),
    status: "done",
    resumeStatus: toResumeStatus(task.status),
  };
}

export function runTodoSmokeChecks() {
  const baseLists: TodoListRecord[] = [
    {
      id: "launch-list",
      name: LAUNCH_LIST_NAME,
      tasks: [
        {
          ...buildSeedTask(launchTaskDefinitions[0], 1),
          status: "done",
          resumeStatus: "in_progress",
        },
      ],
    },
  ];

  const once = seedLaunchList(baseLists);
  const twice = seedLaunchList(once);
  const launchLists = twice.filter((list) => list.name === LAUNCH_LIST_NAME);
  const launchList = launchLists[0];
  const firstTask = launchList?.tasks[0];
  const toggled = toggleTodoTask(buildSeedTask(launchTaskDefinitions[1], 2));
  const roundTrip = toggleTodoTask(toggled);

  return {
    launchListCount: launchLists.length,
    launchListTaskCount: launchList?.tasks.length ?? 0,
    missingTasksFilled: (launchList?.tasks.length ?? 0) === launchTaskDefinitions.length,
    preservedExistingStatus: firstTask?.status === "done",
    preservedResumeStatus: firstTask?.resumeStatus === "in_progress",
    roundTripOk: roundTrip.status === "not_started",
  };
}
