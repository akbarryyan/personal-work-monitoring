# System Design: Personal Work Monitoring Dashboard

## 1. Overview

Personal Work Monitoring Dashboard adalah aplikasi web pribadi untuk membantu user memantau pekerjaan harian, mingguan, dan progress project secara terstruktur.

Aplikasi ini bukan sekadar to-do list sederhana. Fokus utama aplikasi adalah membantu user menjawab pertanyaan berikut:

* Apa pekerjaan yang harus dikerjakan hari ini?
* Task mana yang sudah telat?
* Task mana yang sedang dikerjakan?
* Task mana yang terblokir?
* Project mana yang sedang aktif?
* Seberapa banyak task yang selesai minggu ini?

Aplikasi ini dibangun menggunakan:

* Next.js
* TypeScript
* Supabase
* PostgreSQL
* Tailwind CSS
* shadcn/ui
* Vercel

---

## 2. Goals

Tujuan utama aplikasi:

1. Membantu user mengelola pekerjaan pribadi dan pekerjaan kantor.
2. Menampilkan dashboard monitoring yang ringkas dan jelas.
3. Memberikan informasi task berdasarkan status, prioritas, dan deadline.
4. Memisahkan pekerjaan berdasarkan project.
5. Menyediakan sistem login agar data user aman dan terpisah.
6. Menjadi fondasi untuk fitur lanjutan seperti Kanban, recurring task, reminder, dan weekly report.

---

## 3. Non-Goals

Fitur berikut tidak menjadi fokus MVP:

* Team collaboration
* Real-time chat
* Comment system
* File attachment
* Complex notification system
* Calendar integration
* AI task recommendation
* Mobile app native

Fitur-fitur tersebut dapat ditambahkan pada fase lanjutan setelah MVP stabil.

---

## 4. Tech Stack

### Frontend

* Next.js App Router
* TypeScript
* Tailwind CSS
* shadcn/ui
* React Hook Form
* Zod
* date-fns

### Backend

* Supabase Auth
* Supabase PostgreSQL
* Supabase Row Level Security
* Supabase Server Client

### Deployment

* Vercel untuk hosting Next.js
* Supabase untuk database dan authentication

---

## 5. Core Features

## 5.1 Authentication

User dapat login dan logout menggunakan Supabase Auth.

MVP authentication:

* Email login
* Password login
* Protected route

Fitur lanjutan:

* Google OAuth
* GitHub OAuth
* Magic link

---

## 5.2 Project Management

User dapat membuat project untuk mengelompokkan task.

Contoh project:

* Kantor
* Freelance
* Personal
* Belajar
* Live Streaming App
* Money Tracker

Fitur project:

* Create project
* Read project list
* Update project
* Delete project
* Set project color
* View task berdasarkan project

---

## 5.3 Task Management

User dapat membuat, membaca, mengubah, dan menghapus task.

Field utama task:

* Title
* Description
* Project
* Status
* Priority
* Due date
* Started at
* Completed at

Status task:

* todo
* in_progress
* blocked
* review
* done
* cancelled

Priority task:

* low
* medium
* high
* urgent

---

## 5.4 Dashboard Monitoring

Dashboard utama harus langsung menampilkan kondisi pekerjaan user.

Informasi yang wajib ditampilkan:

* Total task hari ini
* Total task overdue
* Total task in progress
* Total task blocked
* Total task done minggu ini
* Daftar task prioritas hari ini
* Daftar task yang overdue
* Daftar task yang blocked

Dashboard harus membantu user menentukan fokus kerja dalam waktu kurang dari 5 detik.

---

## 5.5 Task Filtering

Aplikasi harus menyediakan filter task berdasarkan kondisi berikut:

* All Tasks
* Today
* This Week
* Overdue
* In Progress
* Blocked
* Review
* Done
* Cancelled

Contoh route:

```txt
/tasks
/tasks?filter=today
/tasks?filter=this-week
/tasks?filter=overdue
/tasks?filter=in-progress
/tasks?filter=blocked
/tasks?filter=done
```

---

## 6. User Roles

Untuk MVP, hanya ada satu role:

```txt
authenticated user
```

Setiap user hanya boleh mengakses data miliknya sendiri.

Tidak ada admin panel pada MVP.

---

## 7. Database Design

Database menggunakan Supabase PostgreSQL.

---

## 7.1 Table: projects

```sql
create table projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  name text not null,
  description text,
  color text,

  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

### Notes

* `user_id` digunakan untuk memastikan project hanya milik user tertentu.
* `color` digunakan untuk kebutuhan UI seperti badge atau sidebar indicator.
* Jika user dihapus, semua project miliknya ikut dihapus.

---

## 7.2 Table: tasks

```sql
create table tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references projects(id) on delete set null,

  title text not null,
  description text,

  status text not null default 'todo',
  priority text not null default 'medium',

  due_date date,
  started_at timestamp with time zone,
  completed_at timestamp with time zone,

  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

### Notes

* `project_id` boleh null agar task tetap ada walaupun project dihapus.
* `completed_at` diisi saat status berubah menjadi `done`.
* `started_at` diisi saat status berubah menjadi `in_progress`.

---

## 7.3 Optional Table: tags

Table ini tidak wajib untuk MVP. Gunakan jika aplikasi mulai butuh filter tambahan.

```sql
create table tags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  name text not null,

  created_at timestamp with time zone default now()
);
```

---

## 7.4 Optional Table: task_tags

```sql
create table task_tags (
  task_id uuid not null references tasks(id) on delete cascade,
  tag_id uuid not null references tags(id) on delete cascade,

  primary key (task_id, tag_id)
);
```

---

## 8. Database Constraints

Tambahkan constraint agar nilai status dan priority tetap valid.

```sql
alter table tasks
add constraint tasks_status_check
check (
  status in (
    'todo',
    'in_progress',
    'blocked',
    'review',
    'done',
    'cancelled'
  )
);
```

```sql
alter table tasks
add constraint tasks_priority_check
check (
  priority in (
    'low',
    'medium',
    'high',
    'urgent'
  )
);
```

---

## 9. Updated At Trigger

Agar `updated_at` otomatis berubah setiap update data.

```sql
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;
```

```sql
create trigger update_projects_updated_at
before update on projects
for each row
execute function update_updated_at_column();
```

```sql
create trigger update_tasks_updated_at
before update on tasks
for each row
execute function update_updated_at_column();
```

---

## 10. Row Level Security

RLS wajib diaktifkan agar user hanya bisa mengakses data miliknya sendiri.

---

## 10.1 Enable RLS

```sql
alter table projects enable row level security;
alter table tasks enable row level security;
```

Jika menggunakan tags:

```sql
alter table tags enable row level security;
alter table task_tags enable row level security;
```

---

## 10.2 Projects Policy

```sql
create policy "Users can view their own projects"
on projects
for select
using (auth.uid() = user_id);
```

```sql
create policy "Users can create their own projects"
on projects
for insert
with check (auth.uid() = user_id);
```

```sql
create policy "Users can update their own projects"
on projects
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
```

```sql
create policy "Users can delete their own projects"
on projects
for delete
using (auth.uid() = user_id);
```

---

## 10.3 Tasks Policy

```sql
create policy "Users can view their own tasks"
on tasks
for select
using (auth.uid() = user_id);
```

```sql
create policy "Users can create their own tasks"
on tasks
for insert
with check (auth.uid() = user_id);
```

```sql
create policy "Users can update their own tasks"
on tasks
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
```

```sql
create policy "Users can delete their own tasks"
on tasks
for delete
using (auth.uid() = user_id);
```

---

## 11. Application Routes

Gunakan Next.js App Router.

```txt
app/
  page.tsx

  login/
    page.tsx

  dashboard/
    page.tsx

  tasks/
    page.tsx

  tasks/[id]/
    page.tsx

  projects/
    page.tsx

  settings/
    page.tsx
```

---

## 12. Suggested Folder Structure

```txt
app/
  layout.tsx
  page.tsx

  login/
    page.tsx

  dashboard/
    page.tsx

  tasks/
    page.tsx

  tasks/[id]/
    page.tsx

  projects/
    page.tsx

  settings/
    page.tsx

components/
  layout/
    app-sidebar.tsx
    app-header.tsx
    protected-layout.tsx

  dashboard/
    dashboard-stats.tsx
    today-tasks.tsx
    overdue-tasks.tsx
    blocked-tasks.tsx
    weekly-summary.tsx

  tasks/
    task-card.tsx
    task-list.tsx
    task-table.tsx
    task-form.tsx
    task-filter.tsx
    task-status-badge.tsx
    task-priority-badge.tsx
    task-actions.tsx

  projects/
    project-card.tsx
    project-list.tsx
    project-form.tsx

  ui/
    button.tsx
    input.tsx
    textarea.tsx
    dialog.tsx
    dropdown-menu.tsx
    badge.tsx
    card.tsx

lib/
  supabase/
    client.ts
    server.ts
    middleware.ts

  validations/
    task.schema.ts
    project.schema.ts

  utils/
    date.ts
    task.ts

types/
  task.ts
  project.ts

middleware.ts
```

---

## 13. Type Definitions

## 13.1 Task Status

```ts
export type TaskStatus =
  | "todo"
  | "in_progress"
  | "blocked"
  | "review"
  | "done"
  | "cancelled";
```

---

## 13.2 Task Priority

```ts
export type TaskPriority =
  | "low"
  | "medium"
  | "high"
  | "urgent";
```

---

## 13.3 Project Type

```ts
export type Project = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  color: string | null;
  created_at: string;
  updated_at: string;
};
```

---

## 13.4 Task Type

```ts
export type Task = {
  id: string;
  user_id: string;
  project_id: string | null;

  title: string;
  description: string | null;

  status: TaskStatus;
  priority: TaskPriority;

  due_date: string | null;
  started_at: string | null;
  completed_at: string | null;

  created_at: string;
  updated_at: string;

  project?: Project | null;
};
```

---

## 14. Validation Schema

Gunakan Zod untuk validasi form.

## 14.1 Task Schema

```ts
import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(120),
  description: z.string().optional().nullable(),
  project_id: z.string().uuid().optional().nullable(),
  status: z.enum([
    "todo",
    "in_progress",
    "blocked",
    "review",
    "done",
    "cancelled",
  ]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  due_date: z.string().optional().nullable(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;
```

---

## 14.2 Project Schema

```ts
import { z } from "zod";

export const projectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(80),
  description: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
```

---

## 15. Supabase Client Setup

## 15.1 Browser Client

File:

```txt
lib/supabase/client.ts
```

```ts
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

---

## 15.2 Server Client

File:

```txt
lib/supabase/server.ts
```

```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Ignore when called from Server Component.
          }
        },
      },
    }
  );
}
```

---

## 16. Middleware Auth Protection

File:

```txt
middleware.ts
```

Protected routes:

```txt
/dashboard
/tasks
/projects
/settings
```

Basic behavior:

* Jika user belum login dan membuka protected route, redirect ke `/login`.
* Jika user sudah login dan membuka `/login`, redirect ke `/dashboard`.

---

## 17. Main Pages

## 17.1 Login Page

Route:

```txt
/login
```

Fitur:

* Email input
* Password input
* Login button
* Register option jika dibutuhkan

---

## 17.2 Dashboard Page

Route:

```txt
/dashboard
```

Komponen utama:

* DashboardStats
* TodayTasks
* OverdueTasks
* BlockedTasks
* WeeklySummary

Data yang ditampilkan:

* Today tasks count
* Overdue tasks count
* In progress tasks count
* Blocked tasks count
* Done this week count

---

## 17.3 Tasks Page

Route:

```txt
/tasks
```

Fitur:

* Task list
* Filter
* Search
* Create task
* Update status
* Delete task

Query filter:

```txt
/tasks?filter=today
/tasks?filter=overdue
/tasks?filter=blocked
/tasks?filter=in-progress
/tasks?filter=done
```

---

## 17.4 Task Detail Page

Route:

```txt
/tasks/[id]
```

Fitur:

* View task detail
* Edit task
* Change status
* Delete task

---

## 17.5 Projects Page

Route:

```txt
/projects
```

Fitur:

* Project list
* Create project
* Edit project
* Delete project
* View project task count

---

## 18. Task Filtering Logic

## 18.1 Today

Task yang deadline-nya hari ini dan belum selesai.

```txt
due_date = today
status != done
status != cancelled
```

---

## 18.2 This Week

Task yang deadline-nya berada dalam minggu berjalan.

```txt
due_date >= start_of_week
due_date <= end_of_week
status != cancelled
```

---

## 18.3 Overdue

Task yang sudah melewati deadline dan belum selesai.

```txt
due_date < today
status != done
status != cancelled
```

---

## 18.4 In Progress

Task yang sedang dikerjakan.

```txt
status = in_progress
```

---

## 18.5 Blocked

Task yang sedang terblokir.

```txt
status = blocked
```

---

## 18.6 Done

Task yang sudah selesai.

```txt
status = done
```

---

## 19. Status Behavior

Saat status berubah, aplikasi harus menjalankan behavior berikut:

## 19.1 Set to In Progress

Jika task berubah menjadi `in_progress` dan `started_at` masih null:

```txt
started_at = now()
```

---

## 19.2 Set to Done

Jika task berubah menjadi `done`:

```txt
completed_at = now()
```

---

## 19.3 Set from Done to Another Status

Jika task sebelumnya `done`, lalu diubah ke status lain:

```txt
completed_at = null
```

---

## 19.4 Set to Cancelled

Jika task berubah menjadi `cancelled`:

```txt
completed_at = null
```

---

## 20. UI Design Guidelines

Aplikasi harus menggunakan tampilan yang clean, cepat dibaca, dan tidak terlalu ramai.

Prioritas desain:

1. Clarity
2. Fast scanning
3. Minimal clicks
4. Good empty state
5. Responsive layout

---

## 20.1 Sidebar Menu

Sidebar minimal:

```txt
Dashboard
Today
This Week
Overdue
In Progress
Blocked
Projects
Settings
```

---

## 20.2 Task Card

Informasi yang ditampilkan pada task card:

* Title
* Project name
* Status badge
* Priority badge
* Due date
* Quick action

Contoh:

```txt
[High] Fix Agora token refresh
Project: Live Streaming App
Due: Today
Status: Blocked
```

---

## 20.3 Status Badge

Mapping status badge:

```txt
todo        -> Todo
in_progress -> In Progress
blocked     -> Blocked
review      -> Review
done        -> Done
cancelled   -> Cancelled
```

---

## 20.4 Priority Badge

Mapping priority badge:

```txt
low    -> Low
medium -> Medium
high   -> High
urgent -> Urgent
```

---

## 21. Dashboard Metrics

## 21.1 Today Tasks Count

Menghitung task dengan:

```txt
due_date = today
status not in done, cancelled
```

---

## 21.2 Overdue Tasks Count

Menghitung task dengan:

```txt
due_date < today
status not in done, cancelled
```

---

## 21.3 In Progress Count

Menghitung task dengan:

```txt
status = in_progress
```

---

## 21.4 Blocked Count

Menghitung task dengan:

```txt
status = blocked
```

---

## 21.5 Done This Week Count

Menghitung task dengan:

```txt
status = done
completed_at between start_of_week and end_of_week
```

---

## 22. Environment Variables

File `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Jangan gunakan service role key di frontend.

Jika service role key dibutuhkan, hanya gunakan di server-side environment yang aman.

---

## 23. Security Requirements

Aplikasi wajib memenuhi aturan keamanan berikut:

1. RLS wajib aktif untuk semua table user-owned.
2. User hanya boleh membaca data miliknya sendiri.
3. User hanya boleh mengubah data miliknya sendiri.
4. Jangan expose Supabase service role key di client.
5. Validasi semua form dengan Zod.
6. Protected route wajib mengecek session.
7. Jangan percaya data dari client.
8. Delete action harus menggunakan konfirmasi.
9. Error message jangan membocorkan detail sensitif.
10. Gunakan environment variable untuk semua credential.

---

## 24. Deployment Plan

## 24.1 Supabase

Langkah Supabase:

1. Buat project Supabase.
2. Jalankan SQL schema.
3. Aktifkan RLS.
4. Tambahkan policies.
5. Aktifkan Email Auth.
6. Ambil Supabase URL dan Anon Key.

---

## 24.2 Vercel

Langkah Vercel:

1. Push project ke GitHub.
2. Import repository ke Vercel.
3. Tambahkan environment variables:

   * `NEXT_PUBLIC_SUPABASE_URL`
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy.
5. Test login.
6. Test CRUD task.
7. Test RLS dengan user berbeda jika memungkinkan.

---

## 25. MVP Development Checklist

## 25.1 Setup

* [ ] Create Next.js project
* [ ] Install Tailwind CSS
* [ ] Install shadcn/ui
* [ ] Install Supabase packages
* [ ] Setup environment variables
* [ ] Setup Supabase client
* [ ] Setup middleware auth

---

## 25.2 Database

* [ ] Create projects table
* [ ] Create tasks table
* [ ] Add constraints
* [ ] Add updated_at trigger
* [ ] Enable RLS
* [ ] Add RLS policies
* [ ] Test insert/select/update/delete

---

## 25.3 Auth

* [ ] Create login page
* [ ] Create logout action
* [ ] Protect dashboard route
* [ ] Redirect unauthenticated user to login
* [ ] Redirect authenticated user to dashboard

---

## 25.4 Projects

* [ ] Create project form
* [ ] Create project list
* [ ] Edit project
* [ ] Delete project
* [ ] Show project task count

---

## 25.5 Tasks

* [ ] Create task form
* [ ] Create task list
* [ ] Edit task
* [ ] Delete task
* [ ] Change task status
* [ ] Filter task by status
* [ ] Filter task by due date
* [ ] Show priority badge
* [ ] Show status badge

---

## 25.6 Dashboard

* [ ] Show today task count
* [ ] Show overdue task count
* [ ] Show in progress count
* [ ] Show blocked count
* [ ] Show done this week count
* [ ] Show today focus list
* [ ] Show overdue list
* [ ] Show blocked list

---

## 26. Future Roadmap

## 26.1 Phase 2

* [ ] Kanban view
* [ ] Task search
* [ ] Tags
* [ ] Weekly report
* [ ] Completion rate
* [ ] Project progress percentage

---

## 26.2 Phase 3

* [ ] Recurring task
* [ ] Reminder
* [ ] Calendar integration
* [ ] Telegram notification
* [ ] Export CSV
* [ ] Export PDF
* [ ] Dark mode

---

## 27. Acceptance Criteria

MVP dianggap selesai jika:

1. User bisa register/login/logout.
2. User bisa membuat project.
3. User bisa membuat task.
4. User bisa mengubah status task.
5. User bisa menghapus task.
6. User bisa melihat dashboard monitoring.
7. User bisa melihat task overdue.
8. User bisa melihat task hari ini.
9. User bisa melihat task blocked.
10. User tidak bisa mengakses data user lain.
11. Aplikasi berhasil deploy di Vercel.
12. Environment variable sudah aman.
13. RLS Supabase aktif dan berjalan.

---

## 28. Development Principles

Selama development, ikuti prinsip berikut:

1. Build MVP first.
2. Jangan membuat fitur lanjutan sebelum core selesai.
3. Jangan membuat UI kompleks sebelum data flow stabil.
4. Jangan disable RLS hanya karena development error.
5. Jangan expose service role key.
6. Gunakan TypeScript type dengan benar.
7. Validasi input user.
8. Buat komponen kecil dan reusable.
9. Prioritaskan dashboard yang informatif.
10. Pastikan aplikasi benar-benar dipakai untuk monitoring kerja harian.

---

## 29. Recommended First Implementation Order

Urutan pengerjaan yang disarankan:

1. Setup Next.js, Tailwind, shadcn/ui
2. Setup Supabase project
3. Setup auth
4. Setup database schema
5. Setup RLS
6. Build protected layout
7. Build project CRUD
8. Build task CRUD
9. Build task filter
10. Build dashboard stats
11. Polish UI
12. Deploy to Vercel
13. Test production

---

## 30. Summary

Personal Work Monitoring Dashboard adalah aplikasi pribadi untuk memantau pekerjaan berdasarkan project, status, prioritas, dan deadline.

Fokus MVP:

* Auth
* Project CRUD
* Task CRUD
* Status tracking
* Priority tracking
* Due date tracking
* Dashboard monitoring
* Filter Today, Overdue, In Progress, Blocked
* Supabase RLS
* Vercel deployment

Aplikasi harus membantu user mengetahui prioritas kerja harian secara cepat dan jelas.
