"use server";

import { getClient } from "@/lib/rpc/server";
import { revalidatePath } from "next/cache";
import { type UpdateTaskSchema } from "../schemas";

export async function markAsCompleted(id: number, data: UpdateTaskSchema) {
  const client = await getClient();

  const response = await client.api.tasks[":id"].$patch({
    json: { done: data.done || false },
    param: { id }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`${errorData.message}`);
  }

  const taskData = await response.json();

  // Revalidate the page to show the new task
  revalidatePath("/");
  return taskData;
}
