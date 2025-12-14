import { useUsers } from '@/hooks/api/user'
import { useFilters } from '@/hooks/use-filters'
import { DEFAULT_LIST_META } from '@/lib/api'
import { createFileRoute } from '@tanstack/react-router'
import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
} from '@tanstack/react-table'
import type { InferResponseType } from '@tuyau/react-query'
import { tuyau } from '@/lib/tuyau'
import {
  DataTable,
  DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
} from '@/components/simple-data-table'

export const Route = createFileRoute('/(app)/settings/users')({
  component: UserSettings,
  loader: () => {
    return {
      crumb: 'Users',
    }
  },
  validateSearch: () => ({}) as Partial<PaginationState>,
})

type User = InferResponseType<typeof tuyau.api.users.$get>['data'][number]

const columns: ColumnDef<User>[] = [
  {
    header: 'Name',
    cell: ({ row }) => {
      const data = row.original
      return (
        <span>
          {data.firstName} {data.lastName}
        </span>
      )
    },
  },
  {
    header: 'Email',
    accessorKey: 'email',
  },
]

function UserSettings() {
  const { filters, setFilters } = useFilters(Route.id)

  const query = {
    page: filters.pageIndex || DEFAULT_PAGE_INDEX,
    limit: filters.pageSize || DEFAULT_PAGE_SIZE,
  }

  const { status, data } = useUsers(query)

  const table = useReactTable({
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    rowCount: Number(data?.meta?.total || 0),
    state: {
      pagination: {
        pageIndex: query.page,
        pageSize: query.limit,
      },
    },
    onPaginationChange: (pagination) => {
      setFilters(
        typeof pagination === 'function'
          ? pagination({
              pageIndex: query.page,
              pageSize: query.limit,
            })
          : pagination,
      )
    },
    enableColumnFilters: false,
    filterFns: {
      fuzzy: () => true,
    },
  })

  return (
    <div className="px-4 lg:px-6 space-y-4">
      <h1 className="font-bold text-xl text-foreground">User Settings</h1>

      <DataTable
        columns={columns}
        className="mt-8"
        meta={data?.meta || DEFAULT_LIST_META}
        table={table}
        dataStatus={status}
      />
    </div>
  )
}
