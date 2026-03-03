import { notFound } from "next/navigation";

import { TodoWorkspace } from "@/components/todo-workspace";
import { findSeededTodoTask } from "@/lib/todo-data";

type TaskDetailPageProps = {
  params: Promise<{
    taskId: string;
  }>;
};

export default async function TaskDetailPage({
  params,
}: TaskDetailPageProps) {
  const { taskId } = await params;

  if (!findSeededTodoTask(taskId)) {
    notFound();
  }

  return <TodoWorkspace initialSelectedTaskId={taskId} />;
}
