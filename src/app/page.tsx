import * as React from "react"

import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import type { SearchParams } from "@/types"
import { Shell } from "@/components/shell"
import { TasksTable } from "./_components/tasks-table"
import { getTasks } from "./_lib/queries"
import { searchParamsSchema } from "./_lib/validations"

export interface IndexPageProps {
  searchParams: SearchParams
}

export default function IndexPage({ searchParams }: IndexPageProps) {
  const search = searchParamsSchema.parse(searchParams)

  const tasksPromise = getTasks(search)

  return (
    <Shell>
      <React.Suspense
        fallback={
          <DataTableSkeleton columnCount={4} filterableColumnCount={2} />
        }
      >
        {/**
         * The `TasksTable` component is used to render the `DataTable` component within it.
         * This is done because the table columns need to be memoized, and the `useDataTable` hook needs to be called in a client component.
         * By encapsulating the `DataTable` component within the `tasktableshell` component, we can ensure that the necessary logic and state management is handled correctly.
         */}
        <TasksTable tasksPromise={tasksPromise} />
      </React.Suspense>
    </Shell>
  )
}
