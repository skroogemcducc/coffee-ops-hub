export type NavItem = {
  href: string;
  label: string;
};

export type TaskCommentRecord = {
  id: string;
  author: string;
  body: string;
  createdLabel: string;
};

export type TaskRecord = {
  id: string;
  title: string;
  status: "open" | "in_progress" | "blocked" | "completed";
  priority: "low" | "medium" | "high" | "urgent";
  owner: string;
  dueLabel: string | null;
  location: string;
  summary: string;
  lastTouch: string;
  comments: TaskCommentRecord[];
};

export type GoalUpdateRecord = {
  id: string;
  author: string;
  summary: string;
  metricLabel: string;
  createdLabel: string;
};

export type GoalRecord = {
  id: string;
  title: string;
  status: "active" | "paused" | "completed";
  owner: string;
  target: string;
  progress: string;
  horizon: string;
  summary: string;
  updates: GoalUpdateRecord[];
};

export type ActivityRecord = {
  id: string;
  actor: string;
  action: string;
  entityType: "Task" | "Comment" | "Goal" | "Update";
  detail: string;
  when: string;
};

export type ControlModule = {
  href: string;
  label: string;
  note: string;
};

export type InventoryHighlight = {
  id: string;
  item: string;
  stock: string;
  note: string;
};

export type MenuFeature = {
  id: string;
  section: string;
  focus: string;
  note: string;
};

export type BrewNewsItem = {
  id: string;
  headline: string;
  summary: string;
  when: string;
};

export type CalendarEvent = {
  id: string;
  title: string;
  when: string;
  note: string;
};

export const navigationItems: NavItem[] = [
  { href: "/control-board", label: "Board" },
  { href: "/tasks", label: "To-Do" },
  { href: "/calendar", label: "Calendar" },
  { href: "/goals", label: "Goals" },
  { href: "/settings", label: "Settings" },
];

export const controlModules: ControlModule[] = [
  {
    href: "/inventory",
    label: "Inventory",
    note: "Dry storage, cups, beans, and restock watch.",
  },
  {
    href: "/menu",
    label: "Menu",
    note: "Seasonal items, pricing, and featured changes.",
  },
  {
    href: "/brew-news",
    label: "Brew News",
    note: "Internal updates, vendor notes, and reminders.",
  },
  {
    href: "/tasks",
    label: "To-Do",
    note: "Daily task list and owner follow-up.",
  },
  {
    href: "/calendar",
    label: "Calendar",
    note: "Events, prep windows, and upcoming deadlines.",
  },
  {
    href: "/goals",
    label: "Goals",
    note: "Weekly targets and longer-range momentum.",
  },
];

export const dashboardStats = [
  {
    label: "Open Tasks",
    value: "9",
    detail: "2 due today across operations and vendor follow-up",
  },
  {
    label: "Active Goals",
    value: "3",
    detail: "One growth target, one cost target, one process goal",
  },
  {
    label: "Recent Handoff",
    value: "12 min",
    detail: "Average gap between desktop activity and phone check-in",
  },
  {
    label: "Mobile Coverage",
    value: "Ready",
    detail: "Same routes, same context, and installable app shell",
  },
];

export const tasks: TaskRecord[] = [
  {
    id: "bean-vendor-pricing",
    title: "Review bean vendor pricing before next reorder",
    status: "in_progress",
    priority: "high",
    owner: "Jay",
    dueLabel: "Today at 4:00 PM",
    location: "Purchasing",
    summary:
      "Compare the current bean cost against the last two invoices and prepare a clean reorder note.",
    lastTouch: "Updated 18 minutes ago",
    comments: [
      {
        id: "tc-1",
        author: "Wife",
        body: "I added the latest quote from the vendor. The 5 lb bags look better than the smaller cases.",
        createdLabel: "24 minutes ago",
      },
      {
        id: "tc-2",
        author: "Jay",
        body: "I will lock the final quantity after the afternoon count.",
        createdLabel: "18 minutes ago",
      },
    ],
  },
  {
    id: "dry-storage-cycle-count",
    title: "Complete dry storage cycle count",
    status: "open",
    priority: "urgent",
    owner: "Wife",
    dueLabel: "Today at 7:30 PM",
    location: "Dry Storage",
    summary:
      "Count cups, lids, sleeves, syrups, and backup paper goods so tomorrow's order plan is grounded in a real number.",
    lastTouch: "Updated 1 hour ago",
    comments: [
      {
        id: "tc-3",
        author: "Jay",
        body: "Let's split this by shelving row so the phone view stays easy to work through while counting.",
        createdLabel: "1 hour ago",
      },
    ],
  },
  {
    id: "equipment-maintenance-list",
    title: "Refresh the weekly equipment maintenance checklist",
    status: "blocked",
    priority: "medium",
    owner: "Jay",
    dueLabel: null,
    location: "Operations",
    summary:
      "The checklist needs an updated espresso machine descale step and a replacement gasket reminder.",
    lastTouch: "Updated yesterday",
    comments: [
      {
        id: "tc-4",
        author: "Wife",
        body: "Blocked until the new gasket arrives so we can confirm the timing.",
        createdLabel: "Yesterday",
      },
    ],
  },
  {
    id: "march-cost-target",
    title: "Break out March fixed-cost review tasks",
    status: "completed",
    priority: "low",
    owner: "Wife",
    dueLabel: "Completed this morning",
    location: "Finance",
    summary:
      "The recurring cost review is now split into rent, utilities, packaging, and subscriptions.",
    lastTouch: "Closed 3 hours ago",
    comments: [
      {
        id: "tc-5",
        author: "Jay",
        body: "This is cleaner. It should make the mobile check-ins faster during the day.",
        createdLabel: "3 hours ago",
      },
    ],
  },
];

export const goals: GoalRecord[] = [
  {
    id: "raise-average-ticket",
    title: "Raise average ticket size",
    status: "active",
    owner: "Jay",
    target: "Target: +8% average ticket by May 31",
    progress: "Current pace: +3.2%",
    horizon: "90-day goal",
    summary:
      "Use cleaner add-on prompts, better front-counter placement, and a small test menu adjustment.",
    updates: [
      {
        id: "gu-1",
        author: "Jay",
        summary: "Tested a bundled pastry prompt during the lunch window. Early response looks strong.",
        metricLabel: "+1.1% this week",
        createdLabel: "This afternoon",
      },
      {
        id: "gu-2",
        author: "Wife",
        summary: "Need one tighter script for the morning rush so the upsell stays consistent.",
        metricLabel: "Process note",
        createdLabel: "Yesterday",
      },
    ],
  },
  {
    id: "lower-packaging-waste",
    title: "Lower packaging waste",
    status: "active",
    owner: "Wife",
    target: "Target: reduce cup and lid overuse by 12%",
    progress: "Current pace: 5% reduction",
    horizon: "Monthly goal",
    summary:
      "Track avoidable waste by shift and tighten restock quantities so open sleeves do not pile up.",
    updates: [
      {
        id: "gu-3",
        author: "Wife",
        summary: "Shift-by-shift counts are easy to review on the phone now. Keep that pattern.",
        metricLabel: "5% reduction",
        createdLabel: "2 hours ago",
      },
    ],
  },
  {
    id: "owner-weekly-alignment",
    title: "Owner weekly alignment rhythm",
    status: "completed",
    owner: "Jay",
    target: "Target: one clear weekly planning review every Sunday",
    progress: "Complete and operating",
    horizon: "Recurring operating cadence",
    summary:
      "Keep the whole week visible in one place so desktop planning and mobile follow-through stay synced.",
    updates: [
      {
        id: "gu-4",
        author: "Jay",
        summary: "The dashboard summary is enough to start each week without searching through messages.",
        metricLabel: "Locked in",
        createdLabel: "Last Sunday",
      },
    ],
  },
];

export const activityEntries: ActivityRecord[] = [
  {
    id: "ac-1",
    actor: "Jay",
    action: "updated task",
    entityType: "Task",
    detail: "Review bean vendor pricing before next reorder",
    when: "18 minutes ago",
  },
  {
    id: "ac-2",
    actor: "Wife",
    action: "commented",
    entityType: "Comment",
    detail: "Added a vendor quote note to the bean pricing task",
    when: "24 minutes ago",
  },
  {
    id: "ac-3",
    actor: "Wife",
    action: "posted goal update",
    entityType: "Update",
    detail: "Lower packaging waste",
    when: "2 hours ago",
  },
  {
    id: "ac-4",
    actor: "Jay",
    action: "created goal",
    entityType: "Goal",
    detail: "Raise average ticket size",
    when: "Yesterday",
  },
];

export const inventoryHighlights: InventoryHighlight[] = [
  {
    id: "inv-1",
    item: "12 oz hot cups",
    stock: "4 sleeves left",
    note: "Place a reorder before Tuesday afternoon.",
  },
  {
    id: "inv-2",
    item: "House beans",
    stock: "18 lb on hand",
    note: "Enough for the next two service days if sales hold.",
  },
  {
    id: "inv-3",
    item: "Vanilla syrup",
    stock: "2 bottles",
    note: "Safe for now, but add to next vendor order.",
  },
];

export const menuFeatures: MenuFeature[] = [
  {
    id: "menu-1",
    section: "Morning push",
    focus: "Latte + pastry bundle",
    note: "Lead with the bundle during the first two rush hours.",
  },
  {
    id: "menu-2",
    section: "Seasonal special",
    focus: "Maple cold brew",
    note: "Keep signage simple and keep the syrup count visible.",
  },
  {
    id: "menu-3",
    section: "Margin watch",
    focus: "Alternative milk upcharge",
    note: "Confirm pricing still protects the margin this month.",
  },
];

export const brewNewsItems: BrewNewsItem[] = [
  {
    id: "news-1",
    headline: "Vendor cutoff moved earlier this week",
    summary: "The bean order has to be in by 2:00 PM on Tuesday instead of 4:00 PM.",
    when: "Today",
  },
  {
    id: "news-2",
    headline: "Trailer inspection reminder",
    summary: "Run the quick generator and sink checklist before Friday service.",
    when: "Tomorrow",
  },
  {
    id: "news-3",
    headline: "Weekend event inquiry came in",
    summary: "Review the location note and decide whether the setup window works.",
    when: "This week",
  },
];

export const calendarEvents: CalendarEvent[] = [
  {
    id: "cal-1",
    title: "Bean vendor order cutoff",
    when: "Tuesday · 2:00 PM",
    note: "Finalize counts before lunch.",
  },
  {
    id: "cal-2",
    title: "Trailer prep for downtown stop",
    when: "Friday · 7:00 AM",
    note: "Ice, milk, cups, and generator check.",
  },
  {
    id: "cal-3",
    title: "Weekly owner reset",
    when: "Sunday · 6:30 PM",
    note: "Review goals, orders, and the next week plan.",
  },
];

export function getTaskById(taskId: string) {
  return tasks.find((task) => task.id === taskId);
}

export function getGoalById(goalId: string) {
  return goals.find((goal) => goal.id === goalId);
}

export function getTaskTone(status: TaskRecord["status"]) {
  switch (status) {
    case "completed":
      return "good";
    case "blocked":
      return "alert";
    case "in_progress":
      return "accent";
    default:
      return "neutral";
  }
}

export function getGoalTone(status: GoalRecord["status"]) {
  switch (status) {
    case "completed":
      return "good";
    case "paused":
      return "warn";
    default:
      return "accent";
  }
}

export function getPriorityTone(priority: TaskRecord["priority"]) {
  switch (priority) {
    case "urgent":
      return "alert";
    case "high":
      return "warn";
    case "low":
      return "neutral";
    default:
      return "accent";
  }
}
