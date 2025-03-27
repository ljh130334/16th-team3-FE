"use client";

import { TaskResponse } from "@/types/task";

type Props = {
    task: TaskResponse;
}

export default function RetrospectionPageClient({ task }: Props) {
  return (
    <div>
      <h1>{task.name}</h1>
    </div>
  );
};