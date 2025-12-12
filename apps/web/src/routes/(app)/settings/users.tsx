import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/settings/users')({
  component: UserSettingsComponent,
  loader: () => {
    return {
      crumb: 'Users',
    }
  },
})

function UserSettingsComponent() {
  return (
    <div className="px-4 lg:px-6 space-y-4">
      <h1 className="font-bold text-xl text-foreground">User Settings</h1>
    </div>
  )
}
