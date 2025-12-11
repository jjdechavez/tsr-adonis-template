import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '../../lib/auth'

export const Route = createFileRoute('/(app)/dashboard')({
  component: DashboardComponent,
})

function DashboardComponent() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Dashboard</h1>
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Welcome back!</h2>
              <p className="text-gray-600">
                {user?.firstName} {user?.lastName} ({user?.email})
              </p>
            </div>
            <div className="mt-6">
              <p className="text-gray-500">This is a protected route that requires authentication.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

