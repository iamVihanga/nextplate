"use client";
import { PlusCircleIcon } from "lucide-react";
import { useCallback, useId, useState } from "react";

import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@repo/ui/components/dialog";
import { Input } from "@repo/ui/components/input";
import { useAppForm } from "@repo/ui/components/tanstack-form";

import { toast } from "sonner";
import { addTask } from "../actions/add-task.action";
import { addTaskSchema } from "../schemas";

export function AddNewTask() {
  const [open, setOpen] = useState<boolean>(false);
  const toastId = useId();

  const form = useAppForm({
    validators: { onChange: addTaskSchema },
    defaultValues: {
      name: ""
    },
    onSubmit: async ({ value }) => {
      try {
        toast.loading("Creating new task...", { id: toastId });

        await addTask(value);

        toast.success("Task created successfully!", { id: toastId });
      } catch (error) {
        const err = error as Error;
        console.error("Failed to add task:", error);
        toast.error(`Failed: ${err.message}`, {
          id: toastId
        });
      } finally {
        setOpen(false);
      }
    }
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button icon={<PlusCircleIcon />}>Add new Task</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form.AppForm>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Create new Task</DialogTitle>
              <DialogDescription>
                Create a new task by filling out the details below.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4">
              <form.AppField
                name="name"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel>Task Name</field.FormLabel>
                    <field.FormControl>
                      <Input
                        placeholder="Go to the store"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                    </field.FormControl>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>

              <Button type="submit" loading={form.state.isSubmitting}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </form.AppForm>
      </DialogContent>
    </Dialog>
  );
}
