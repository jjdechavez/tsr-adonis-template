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

router.get('/health', [HealthChecksController])
router.post('/api/session', [SessionController, 'store'])

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
  })
  .prefix('/api')
  .middleware([middleware.auth({ guards: ['api'] })])
