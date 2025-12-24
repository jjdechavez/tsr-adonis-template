import { SettingTab } from '@/components/setting-tab'
import {
  DataTable,
  DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
} from '@/components/data-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useFilters } from '@/hooks/use-filters'
import { tuyau } from '@/main'
import type { Invite } from '@/types/invite'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
} from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import { userSettingTabs } from './settings.users'
import { DEFAULT_LIST_META } from '@/lib/api'
import { CreateInvite } from '@/components/setting-invite-overlay'

export const Route = createFileRoute('/(app)/settings/invites')({
  component: InviteSettings,
  loader: () => {
    return { crumb: 'Invites' }
  },
  validateSearch: () => ({}) as Partial<PaginationState>,
})

const columns: ColumnDef<Invite>[] = [
  {
    header: 'Email',
    accessorKey: 'email',
  },
  {
    header: 'Role',
    accessorKey: 'role',
  },
  {
    header: 'Invited By',
    accessorKey: 'invitedBy',
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({}) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={'ghost'}>
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

function InviteSettings() {
  const { filters, setFilters } = useFilters(Route.id)
  const query = {
    page: filters.pageIndex || DEFAULT_PAGE_INDEX,
    limit: filters.pageSize || DEFAULT_PAGE_SIZE,
  }

  const { status, data } = useQuery(
    tuyau.api.invites.$get.queryOptions({ payload: query }),
  )

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
      <div className="flex items-center justify-between">
        <SettingTab tabs={userSettingTabs} />
        <CreateInvite />
      </div>

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
