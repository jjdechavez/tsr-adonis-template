import Header from '@/components/Header'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)')({
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
      <Outlet />{' '}
    </>
  )
}
