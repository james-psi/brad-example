import * as React from "react"
import { tasks, type Task } from "@/db/schema"
import { ArrowUpIcon, CheckCircledIcon, TrashIcon } from "@radix-ui/react-icons"
import { SelectTrigger } from "@radix-ui/react-select"
import { type Table } from "@tanstack/react-table"
import { toast } from "sonner"

import { getErrorMessage } from "@/lib/handle-error"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select"

import {
  deleteTask,
  // updateTaskPriority,
  updateTaskStatus,
} from "../_lib/actions"

export function deleteSelectedRows({
  table,
  event,
}: {
  table: Table<Task>
  event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
}) {
  event?.preventDefault()
  const selectedRows = table.getFilteredSelectedRowModel().rows as {
    original: Task
  }[]

  toast.promise(
    Promise.all(
      selectedRows.map(async (row) =>
        deleteTask({
          id: row.original.id,
        })
      )
    ),
    {
      loading: "Deleting...",
      success: "Tasks deleted",
      error: (err) => getErrorMessage(err),
    }
  )
}

export function updateTasksStatus({
  table,
  status,
}: {
  table: Table<Task>
  status: string
}) {
  const selectedRows = table.getFilteredSelectedRowModel().rows as unknown as {
    original: Task
  }[]

  toast.promise(
    Promise.all(
      selectedRows.map(async (row) =>
        updateTaskStatus({
          id: row.original.id,
          status: status as Task["status"],
        })
      )
    ),
    {
      loading: "Updating...",
      success: "Tasks updated",
      error: (err) => getErrorMessage(err),
    }
  )
}

// export function updateTasksPriority({
//   table,
//   priority,
// }: {
//   table: Table<Task>
//   priority: string
// }) {
//   const selectedRows = table.getFilteredSelectedRowModel().rows as unknown as {
//     original: Task
//   }[]

//   toast.promise(
//     Promise.all(
//       selectedRows.map(async (row) =>
//         updateTaskPriority({
//           id: row.original.id,
//           priority: priority as Task["priority"],
//         })
//       )
//     ),
//     {
//       loading: "Updating...",
//       success: "Tasks updated",
//       error: (err) => getErrorMessage(err),
//     }
//   )
// }

export function TasksTableFloatingBarContent(table: Table<Task>) {
  return (
    <div className="justify-between gap-2 align-middle">
      <Select
        onValueChange={(value) => updateTasksStatus({ table, status: value })}
      >
        <SelectTrigger asChild>
          <Button
            aria-label="Delete selected rows"
            title="Status"
            variant="ghost"
            size="icon"
            className="size-7 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
          >
            <CheckCircledIcon className="size-4" aria-hidden="true" />
          </Button>
        </SelectTrigger>
        <SelectContent align="center">
          <SelectGroup>
            {tasks.status.enumValues.map((status) => (
              <SelectItem key={status} value={status} className="capitalize">
                {status}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select
        onValueChange={
          // (value) => updateTasksPriority({ table, priority: value })
          () => { }
        }
      >
        <SelectTrigger asChild>
          <Button
            title="Category"
            variant="ghost"
            size="icon"
            className="size-7 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
          >
            <ArrowUpIcon className="size-4" aria-hidden="true" />
          </Button>
        </SelectTrigger>
        <SelectContent align="center">
          <SelectGroup>
            {tasks.category.enumValues.map((category) => (
              <SelectItem
                key={category}
                value={category}
                className="capitalize"
              >
                {category}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button
        title="Delete"
        variant="ghost"
        size="icon"
        className="size-7"
        onClick={(event) => {
          table.toggleAllPageRowsSelected(false)
          deleteSelectedRows?.({ table, event })
        }}
      >
        <TrashIcon className="size-4" aria-hidden="true" />
        <span className="sr-only">Delete</span>
      </Button>
    </div>
  )
}
