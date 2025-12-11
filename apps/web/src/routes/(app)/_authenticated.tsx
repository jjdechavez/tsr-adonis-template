import Header from '@/components/Header'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/_authenticated')({
  beforeLoad: ({ context, location }) => {
    const { auth } = context

    if (!auth.isAuthenticated && !auth.isLoading && !auth.user) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return (
    <>
      <Header />
      <div className="min-h-screen">
        <Outlet />
      </div>
    </>
  )
}
