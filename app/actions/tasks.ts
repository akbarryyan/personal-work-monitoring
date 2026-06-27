"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type TaskFormState = {
  error: string | null;
  success: boolean;
};

export async function createTaskAction(
  _prev: TaskFormState,
  formData: FormData
): Promise<TaskFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthenticated.", success: false };

  const title = (formData.get("title") as string)?.trim();
  if (!title) return { error: "Title wajib diisi.", success: false };

  const project_id = (formData.get("project_id") as string) || null;
  const description = (formData.get("description") as string)?.trim() || null;
  const status = (formData.get("status") as string) || "todo";
  const priority = (formData.get("priority") as string) || "medium";
  const due_date = (formData.get("due_date") as string) || null;

  const { error } = await supabase.from("tasks").insert({
    user_id: user.id,
    project_id: project_id || null,
    title,
    description,
    status,
    priority,
    due_date: due_date || null,
  });

  if (error) return { error: error.message, success: false };

  revalidatePath("/tasks");
  return { error: null, success: true };
}

export async function patchTaskFieldAction(
  id: string,
  field: "status" | "priority" | "due_date",
  value: string | null
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthenticated." };

  const updates: Record<string, unknown> = { [field]: value };

  if (field === "status") {
    const { data: cur } = await supabase
      .from("tasks")
      .select("status, started_at")
      .eq("id", id)
      .single();

    if (value === "in_progress" && !cur?.started_at)
      updates.started_at = new Date().toISOString();
    if (value === "done")
      updates.completed_at = new Date().toISOString();
    if (value === "cancelled" || (cur?.status === "done" && value !== "done"))
      updates.completed_at = null;
  }

  const { error } = await supabase
    .from("tasks")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/tasks");
  revalidatePath(`/tasks/${id}`);
  return { error: null };
}

export async function updateTaskAction(
  _prev: TaskFormState,
  formData: FormData
): Promise<TaskFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthenticated.", success: false };

  const id = (formData.get("id") as string)?.trim();
  const title = (formData.get("title") as string)?.trim();
  if (!title) return { error: "Title wajib diisi.", success: false };

  const project_id = (formData.get("project_id") as string) || null;
  const description = (formData.get("description") as string)?.trim() || null;
  const status = (formData.get("status") as string) || "todo";
  const priority = (formData.get("priority") as string) || "medium";
  const due_date = (formData.get("due_date") as string) || null;

  /* Fetch current task to handle date fields correctly */
  const { data: current } = await supabase
    .from("tasks")
    .select("status, started_at")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  const updates: Record<string, unknown> = {
    title,
    description,
    project_id: project_id || null,
    status,
    priority,
    due_date: due_date || null,
  };

  if (status === "in_progress" && !current?.started_at) {
    updates.started_at = new Date().toISOString();
  }
  if (status === "done") {
    updates.completed_at = new Date().toISOString();
  }
  if ((status === "cancelled" || (current?.status === "done" && status !== "done"))) {
    updates.completed_at = null;
  }

  const { error } = await supabase
    .from("tasks")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message, success: false };

  revalidatePath("/tasks");
  revalidatePath(`/tasks/${id}`);
  return { error: null, success: true };
}
