import type { tuyau } from '@/main'
import type { InferResponseType } from '@tuyau/react-query'

export type Invite = InferResponseType<
  typeof tuyau.api.invites.$get
>['data'][number]
