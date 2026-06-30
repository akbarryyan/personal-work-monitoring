"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type SettingsFormState = {
  error: string | null;
  success: boolean;
};

export async function updateProfileAction(
  _prev: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthenticated.", success: false };

  const full_name = (formData.get("full_name") as string)?.trim();
  if (!full_name) return { error: "Nama tidak boleh kosong.", success: false };

  const { error } = await supabase.auth.updateUser({
    data: { full_name },
  });

  if (error) return { error: error.message, success: false };

  revalidatePath("/settings");
  revalidatePath("/", "layout");
  return { error: null, success: true };
}

export async function updatePasswordAction(
  _prev: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthenticated.", success: false };

  const newPassword = (formData.get("new_password") as string) ?? "";
  const confirmPassword = (formData.get("confirm_password") as string) ?? "";

  if (newPassword.length < 8)
    return { error: "Password minimal 8 karakter.", success: false };
  if (newPassword !== confirmPassword)
    return { error: "Konfirmasi password tidak cocok.", success: false };

  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) return { error: error.message, success: false };

  return { error: null, success: true };
}
