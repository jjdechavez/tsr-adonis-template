/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const SessionController = () => import('#controllers/session_controller')
const HealthChecksController = () => import('#controllers/health_checks_controller')
const UsersController = () => import('#controllers/users_controller')
const InvitesController = () => import('#controllers/invites_controller')

router.get('/health', [HealthChecksController])
router.post('/api/session', [SessionController, 'store'])

router.get('/invites/:id/confirm', [InvitesController, 'confirm']).as('invites.confirm')

router
  .group(() => {
    router
      .group(() => {
        router.delete('/', [SessionController, 'destroy'])
        router.get('/', [SessionController, 'me'])
      })
      .prefix('/session')

    router
      .group(() => {
        router.get('/', [UsersController, 'index'])
        router.put('/:id', [UsersController, 'update'])
      })
      .prefix('/users')

    router
      .group(() => {
        router.post('/', [InvitesController, 'store'])
        router.get('/', [InvitesController, 'index'])
        router.put('/:id', [InvitesController, 'update'])
        router.get('/:id/generate', [InvitesController, 'generateLink'])
      })
      .prefix('/invites')
  })
  .prefix('/api')
  .middleware([middleware.auth({ guards: ['api'] })])
