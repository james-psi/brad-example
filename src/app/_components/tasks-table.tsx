"use client"

import * as React from "react"
import { tasks, type Task } from "@/db/schema"
import type {
  DataTableFilterableColumn,
  DataTableSearchableColumn,
} from "@/types"
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  DotsHorizontalIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons"
import { type ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"

import { getErrorMessage } from "@/lib/handle-error"
import { useDataTable } from "@/hooks/use-data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"

// import { deleteTask, updateTaskLabel } from "../_lib/actions"
import { type getTasks } from "../_lib/queries"
import {
  deleteSelectedRows,
  TasksTableFloatingBarContent,
} from "./tasks-table-actions"

interface TasksTableProps {
  tasksPromise: ReturnType<typeof getTasks>
}

export function TasksTable({ tasksPromise }: TasksTableProps) {
  // Learn more about React.use here: https://react.dev/reference/react/use
  const { data, pageCount } = React.use(tasksPromise)

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo<ColumnDef<Task, unknown>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
            className="translate-y-[2px]"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="translate-y-[2px]"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      // {
      //   accessorKey: "code",
      //   header: ({ column }) => (
      //     <DataTableColumnHeader column={column} title="Task" />
      //   ),
      //   cell: ({ row }) => (
      //     <div className="w-[80px]">{row.getValue("code")}</div>
      //   ),
      //   enableSorting: false,
      //   enableHiding: false,
      // },
      {
        accessorKey: "title",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Title" />
        ),
        cell: ({ row }) => {
          // const label = tasks.label.enumValues.find(
          //   (label) => label === row.original.label
          // )

          return (
            <div className="flex space-x-2">
              {/* {label && <Badge variant="outline">{label}</Badge>} */}
              <span className="max-w-[500px] truncate font-medium">
                {row.getValue("title")}
              </span>
            </div>
          )
        },
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
          const status = tasks.status.enumValues.find(
            (status) => status === row.original.status
          )

          if (!status) return null

          return (
            <div className="flex w-[100px] items-center">
              {status === "inactive" ? (
                <CrossCircledIcon
                  className="mr-2 size-4 text-muted-foreground"
                  aria-hidden="true"
                />
              ) : status === "active" ? (
                <CheckCircledIcon
                  className="mr-2 size-4 text-muted-foreground"
                  aria-hidden="true"
                />
              ) : (
                <CircleIcon
                  className="mr-2 size-4 text-muted-foreground"
                  aria-hidden="true"
                />
              )}
              <span className="capitalize">{status}</span>
            </div>
          )
        },
        filterFn: (row, id, value) => {
          return Array.isArray(value) && value.includes(row.getValue(id))
        },
      },
      {
        accessorKey: "category",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Category" />
        ),
        cell: ({ row }) => {
          const category = tasks.category.enumValues.find(
            (category) => category === row.original.category
          )

          if (!category) {
            return null
          }

          return (
            <div className="flex items-center">
              <span className="capitalize">{category}</span>
            </div>
          )
        },
        filterFn: (row, id, value) => {
          return Array.isArray(value) && value.includes(row.getValue(id))
        },
      },
      {
        accessorKey: "assigned_to",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Assigned To" />
        ),
        cell: ({ row }) => {
          const assigned_to = tasks.assigned_to.enumValues.find(
            (assigned_to) => assigned_to === row.original.assigned_to
          )

          if (!assigned_to) {
            return null
          }

          return (
            <div className="flex items-center">
              <span className="capitalize">{assigned_to}</span>
            </div>
          )
        },
        filterFn: (row, id, value) => {
          return Array.isArray(value) && value.includes(row.getValue(id))
        },
      },
      {
        accessorKey: "last_action_taken",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Last Action Taken" />
        ),
        cell: ({ row }) => {
          const last_action_taken = tasks.last_action_taken.enumValues.find(
            (last_action_taken) => last_action_taken === row.original.last_action_taken
          )

          if (!last_action_taken) {
            return null
          }

          return (
            <div className="flex items-center">
              <span className="capitalize">{last_action_taken}</span>
            </div>
          )
        },
        filterFn: (row, id, value) => {
          return Array.isArray(value) && value.includes(row.getValue(id))
        },
      },
      {
        id: "actions",
        cell: function Cell({ row }) {
          const [isUpdatePending, startUpdateTransition] = React.useTransition()
          const [isDeletePending, startDeleteTransition] = React.useTransition()

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label="Open menu"
                  variant="ghost"
                  className="flex size-8 p-0 data-[state=open]:bg-muted"
                >
                  <DotsHorizontalIcon className="size-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]">
                {/* <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup
                      value={row.original.label}
                      onValueChange={
                        (value) => {
                        startUpdateTransition(() => {
                          toast.promise(
                            updateTaskLabel({
                              id: row.original.id,
                              label: value as Task["label"],
                            }),
                            {
                              loading: "Updating...",
                              success: "Label updated",
                              error: (err) => getErrorMessage(err),
                            }
                          )
                        })
                      }
                    }
                    >
                      {tasks.label.enumValues.map((label) => (
                        <DropdownMenuRadioItem
                          key={label}
                          value={label}
                          className="capitalize"
                          disabled={isUpdatePending}
                        >
                          {label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub> */}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={
                    //   () => {
                    //   startDeleteTransition(() => {
                    //     toast.promise(
                    //       deleteTask({
                    //         id: row.original.id,
                    //       }),
                    //       {
                    //         loading: "Deleting...",
                    //         success: () => {
                    //           row.toggleSelected(false)
                    //           return "Task deleted"
                    //         },
                    //         error: (err: unknown) => getErrorMessage(err),
                    //       }
                    //     )
                    //   })
                    // }
                    () => { }
                  }
                  disabled={isDeletePending}
                >
                  Delete
                  <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ],
    []
  )

  const searchableColumns: DataTableSearchableColumn<Task>[] = [
    {
      id: "title",
      placeholder: "Filter titles...",
    },
  ]

  const filterableColumns: DataTableFilterableColumn<Task>[] = [
    {
      id: "status",
      title: "Status",
      options: tasks.status.enumValues.map((status) => ({
        label: status[0]?.toUpperCase() + status.slice(1),
        value: status,
      })),
    },
    {
      id: "category",
      title: "Category",
      options: tasks.category.enumValues.map((category) => ({
        label: category[0]?.toUpperCase() + category.slice(1),
        value: category,
      })),
    },
    {
      id: "assigned_to",
      title: "Assigned To",
      options: tasks.assigned_to.enumValues.map((assigned_to) => ({
        label: assigned_to[0]?.toUpperCase() + assigned_to.slice(1),
        value: assigned_to,
      })),
    },
    {
      id: "last_action_taken",
      title: "Last Action Taken",
      options: tasks.last_action_taken.enumValues.map((last_action_taken) => ({
        label: last_action_taken[0]?.toUpperCase() + last_action_taken.slice(1),
        value: last_action_taken,
      })),
    },
  ]

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    searchableColumns,
    filterableColumns,
  })

  // Toggling some data-table states for demo
  const id = React.useId()
  const [advancedFilter, setAdvancedFilter] = React.useState(false)
  const [floatingBarContent, setFloatingBarContent] =
    React.useState<React.ReactNode | null>(null)

  return (
    <div className="space-y-4 overflow-hidden">
      <div className="flex w-fit items-center justify-center space-x-4 overflow-x-auto rounded-md border p-4">
        <div className="flex items-center space-x-2">
          <Switch
            id={`advanced-filter-${id}`}
            checked={advancedFilter}
            onCheckedChange={setAdvancedFilter}
          />
          <Label htmlFor={`advanced-filter-${id}`}>Advanced filter</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id={`floating-bar-${id}`}
            checked={!!floatingBarContent}
            onCheckedChange={(checked) =>
              setFloatingBarContent(
                checked ? TasksTableFloatingBarContent(table) : null
              )
            }
          />
          <Label htmlFor={`floating-bar-${id}`}>Floating bar</Label>
        </div>
      </div>
      <DataTable
        table={table}
        columns={columns}
        searchableColumns={searchableColumns}
        filterableColumns={filterableColumns}
        advancedFilter={advancedFilter}
        floatingBarContent={floatingBarContent}
        deleteRowsAction={(event) => deleteSelectedRows({ table, event })}
      />
    </div>
  )
}
