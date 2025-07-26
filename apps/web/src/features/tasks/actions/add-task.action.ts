"use server";

import { getClient } from "@/lib/rpc/server";
import { revalidatePath } from "next/cache";
import { type AddTaskSchema } from "../schemas";

export async function addTask(data: AddTaskSchema) {
  if (!data.name) {
    throw new Error("Task name is required");
  }

  const client = await getClient();

  const response = await client.api.tasks.$post({
    json: {
      ...data,
      done: false
    }
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
