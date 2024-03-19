"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { db } from "@/db"
import { tasks, type Task } from "@/db/schema"
import { faker } from "@faker-js/faker"
import { eq } from "drizzle-orm"
import { customAlphabet } from "nanoid"
import type { z } from "zod"

import { getErrorMessage } from "@/lib/handle-error"
import { createId } from "@/lib/utils"

import type {
  // updateTaskLabelSchema,
  // updateTaskPrioritySchema,
  updateTaskStatusSchema,
} from "./validations"

export async function seedTasks({
  count = 100,
  reset = false,
}: {
  count?: number
  reset?: boolean
}) {
  noStore()
  try {
    const allTasks: Task[] = []

    for (let i = 0; i < count; i++) {
      allTasks.push({
        id: createId(),
        title: faker.hacker
          .phrase()
          .replace(/^./, (letter) => letter.toUpperCase()),
        status:
          faker.helpers.shuffle<Task["status"]>(tasks.status.enumValues)[0] ??
          "active",
        category:
          faker.helpers.shuffle<Task["category"]>(tasks.category.enumValues)[0] ??
          "criminal_case",
        assigned_to: faker.helpers.shuffle<Task["assigned_to"]>(tasks.assigned_to.enumValues)[0] ?? "division_1",
        last_action_taken: faker.helpers.shuffle<Task["last_action_taken"]>(tasks.last_action_taken.enumValues)[0] ?? "filed_motion",
        last_action_date: faker.date.recent(),
      })
    }

    reset && (await db.delete(tasks))

    console.log("📝 Inserting tasks", allTasks.length)

    await db.insert(tasks).values(allTasks)
  } catch (err) {
    console.error(err)
  }
}

// export async function updateTaskLabel({
//   id,
//   label,
// }: z.infer<typeof updateTaskLabelSchema>) {
//   noStore()
//   try {
//     await db.update(tasks).set({ label }).where(eq(tasks.id, id))

//     revalidatePath("/")

//     return {
//       data: null,
//       error: null,
//     }
//   } catch (err) {
//     return {
//       data: null,
//       error: getErrorMessage(err),
//     }
//   }
// }

export async function updateTaskStatus({
  id,
  status,
}: z.infer<typeof updateTaskStatusSchema>) {
  noStore()
  try {
    await db.update(tasks).set({ status }).where(eq(tasks.id, id))

    revalidatePath("/")

    return {
      data: null,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

// export async function updateTaskPriority({
//   id,
//   priority,
// }: z.infer<typeof updateTaskPrioritySchema>) {
//   try {
//     await db.update(tasks).set({ priority }).where(eq(tasks.id, id))

//     revalidatePath("/")
//   } catch (err) {
//     return {
//       data: null,
//       error: getErrorMessage(err),
//     }
//   }
// }

export async function deleteTask(input: { id: string }) {
  try {
    await db.delete(tasks).where(eq(tasks.id, input.id))

    // Create a new task for the deleted one
    await seedTasks({ count: 1 })

    revalidatePath("/")
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}
