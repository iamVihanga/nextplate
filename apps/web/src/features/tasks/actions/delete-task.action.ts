"use server";

import { getClient } from "@/lib/rpc/server";
import { revalidatePath } from "next/cache";

export async function deleteTask(id: number) {
  const client = await getClient();

  const response = await client.api.tasks[":id"].$delete({
    param: { id }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`${errorData.message}`);
  }

  const taskData = await response.json();

  // Revalidate the page to show the new task
  revalidatePath("/");
}
