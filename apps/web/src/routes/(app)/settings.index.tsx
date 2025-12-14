import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { Separator } from '@/components/ui/separator'
import { createFileRoute, Link } from '@tanstack/react-router'
import { UsersIcon } from 'lucide-react'

export const Route = createFileRoute('/(app)/settings/')({
  component: SettingComponent,
})

function SettingComponent() {
  Route.fullPath
  return (
    <div className="px-4 lg:px-6 space-y-4">
      <h1 className="font-bold text-xl text-foreground">Settings</h1>

      <Separator />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Item variant="outline" asChild>
          <Link to="/settings/users">
            <ItemMedia variant="image">
              <UsersIcon className="size-6" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>User</ItemTitle>
              <ItemDescription>Manage users and invites</ItemDescription>
            </ItemContent>
          </Link>
        </Item>
      </div>
    </div>
  )
}
