import { useFilters } from '@/hooks/use-filters'
import { DEFAULT_LIST_META } from '@/lib/api'
import { createFileRoute } from '@tanstack/react-router'
import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
} from '@tanstack/react-table'
import { tuyau } from '@/main'
import {
  DataTable,
  DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
} from '@/components/simple-data-table'
import { useIsMobile } from '@/hooks/use-mobile'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import { UserForm } from '@/components/user-form'
import { useForm } from 'react-hook-form'
import type { User, UserInput } from '@/types/user'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const Route = createFileRoute('/(app)/settings/users')({
  component: UserSettings,
  loader: () => {
    return {
      crumb: 'Users',
    }
  },
  validateSearch: () => ({}) as Partial<PaginationState>,
})

function EditUser({ user }: { user: User }) {
  const queryClient = useQueryClient()
  const isMobile = useIsMobile()
  const form = useForm<UserInput>({
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
    },
  })

  const updateUserMutation = useMutation(
    tuyau.api.users({ id: user.id }).$put.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: tuyau.api.users.$get.pathKey(),
        })
      },
    }),
  )

  const onSubmit = async (payload: UserInput) => {
    toast.promise(
      async () => await updateUserMutation.mutateAsync({ payload }),
      {
        loading: 'Updating user...',
        success: () => `Updated successfully`,
        error: () => 'Failed to update user',
      },
    )
  }

  return (
    <Drawer
      direction={isMobile ? 'bottom' : 'right'}
      onOpenChange={() =>
        form.reset({
          firstName: user.firstName,
          lastName: user.lastName,
        })
      }
    >
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {user.name}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>Edit User</DrawerTitle>
          <DrawerDescription>User personal information</DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <UserForm form={form} onSubmit={onSubmit} />
        </div>
        <DrawerFooter>
          <Button type="submit" form="user-form">
            Update
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

const columns: ColumnDef<User>[] = [
  {
    header: 'Name',
    cell: ({ row }) => {
      const data = row.original
      return <EditUser user={data} />
    },
  },
  {
    header: 'Email',
    accessorKey: 'email',
  },
  {
    header: 'Role',
    accessorKey: 'role',
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

function UserSettings() {
  const { filters, setFilters } = useFilters(Route.id)

  const query = {
    page: filters.pageIndex || DEFAULT_PAGE_INDEX,
    limit: filters.pageSize || DEFAULT_PAGE_SIZE,
  }

  const { status, data } = useQuery(
    tuyau.api.users.$get.queryOptions({ payload: query }),
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
