import { createTuyau } from '@tuyau/client'
import { api } from 'server/api'

export const tuyau = createTuyau({
  api,
  baseUrl: 'http://localhost:3333',
  timeout: 10_000,
  hooks: {
    beforeRequest: [
      (_request) => {
        // const token = getToken()
        // if (token) {
        //   request.headers.set('Authorization', `Bearer ${token}`)
        // }
      },
    ],
  },
})
