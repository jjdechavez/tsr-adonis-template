import type { tuyau } from '@/lib/tuyau'
import type { InferRequestType, InferResponseType } from '@tuyau/react-query'

export type User = InferResponseType<
  typeof tuyau.api.users.$get
>['data'][number]

export type UserInput = InferRequestType<
  (typeof tuyau.api.users[':id']['$put'])
>
