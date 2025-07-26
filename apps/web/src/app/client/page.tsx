"use client";
import { Task } from "@/features/tasks/schemas";
import { getClient } from "@/lib/rpc/client";
import { useState } from "react";

export default function ClientPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const getAllTasks = async () => {
    const client = await getClient();

    const response = await client.api.tasks.$get();

    if (!response.ok) {
      const errorData = await response.json();
      console.log("Failed to fetch tasks:", errorData);
      return;
    }

    const data = await response.json();
    setTasks(data);
  };

  return (
    <div>
      <h2>This is client component</h2>
      <div>
        <button onClick={getAllTasks}>Get All Tasks</button>
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <strong>{task.name}</strong> -{" "}
              {task.done ? "Completed" : "Pending"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
