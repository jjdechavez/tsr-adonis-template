import { createTuyau } from '@tuyau/client'
import { api } from 'server/api'
import { createTuyauReactQueryClient } from '@tuyau/react-query'

import { getAuthToken } from './auth'
import { getContext } from './tanstack-query/root-provider'

export const tuyauClient = createTuyau({
  api,
  baseUrl: 'http://localhost:3333',
  timeout: 10_000,
  hooks: {
    beforeRequest: [
      (request) => {
        const token = getAuthToken()
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`)
        }
      },
    ],
  },
})

const { queryClient } = getContext()

export const tuyau = createTuyauReactQueryClient({
  client: tuyauClient,
  queryClient,
})
