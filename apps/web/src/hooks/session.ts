import { tuyau } from '@/lib/tuyau'
import { useQuery } from '@tanstack/react-query'

export const useSession = () => {
  return useQuery({
    queryKey: ['session'],
    queryFn: () => tuyau.api.session.$get(),
  })
}
