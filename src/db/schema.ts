import { date, pgEnum, timestamp, varchar } from "drizzle-orm/pg-core"

import { createId } from "@/lib/utils"
import { databasePrefix } from "@/lib/constants"
import { pgTable } from "@/db/utils"

export const statusEnum = pgEnum(`${databasePrefix}_status`, [
  "active",
  "inactive",
])

export const categoryEnum = pgEnum(`${databasePrefix}_category`, [
  "criminal_case",
  "civil_case",
  "family_case",
  "administrative_case",
])

export const assignedToEnum = pgEnum(`${databasePrefix}_assigned_to`, [
  "division_1",
  "division_2",
  "division_3",
])

export const lastActionTakenEnum = pgEnum(`${databasePrefix}_last_action_taken`, [
  "filed_motion",
  "received_motion",
  "case_closed",
])

export const tasks = pgTable("tasks", {
  id: varchar("id", { length: 128 })
    .$defaultFn(() => createId())
    .primaryKey(),
  title: varchar("title", { length: 255 }),
  status: statusEnum("status").notNull().default("active"),
  category: categoryEnum("category").notNull().default("criminal_case"),
  assigned_to: assignedToEnum("assigned_to").notNull().default("division_1"),
  last_action_taken: lastActionTakenEnum("last_action_taken").notNull().default("filed_motion"),
  last_action_date: timestamp("last_action_date").notNull().default(new Date()),
})

export type Task = typeof tasks.$inferSelect
export type NewTask = typeof tasks.$inferInsert
