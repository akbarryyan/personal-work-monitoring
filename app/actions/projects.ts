"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ProjectFormState = {
  error: string | null;
  success: boolean;
};

export async function createProjectAction(
  _prev: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthenticated.", success: false };

  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "Nama project wajib diisi.", success: false };

  const description = (formData.get("description") as string)?.trim() || null;
  const color = (formData.get("color") as string) || "#3b82f6";

  const { error } = await supabase.from("projects").insert({
    user_id: user.id,
    name,
    description,
    color,
  });

  if (error) return { error: error.message, success: false };

  revalidatePath("/projects");
  return { error: null, success: true };
}

export async function editProjectAction(
  _prev: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthenticated.", success: false };

  const id = (formData.get("id") as string)?.trim();
  if (!id) return { error: "Project ID tidak valid.", success: false };

  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "Nama project wajib diisi.", success: false };

  const description = (formData.get("description") as string)?.trim() || null;
  const color = (formData.get("color") as string) || "#3b82f6";

  const { error } = await supabase
    .from("projects")
    .update({ name, description, color })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message, success: false };

  revalidatePath("/projects");
  return { error: null, success: true };
}

export async function deleteProjectAction(
  id: string
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthenticated." };

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/projects");
  return { error: null };
}
