import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class SessionsController {
  async store({ request, auth }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    const user = await User.verifyCredentials(email, password)
    return await auth.use('api').createToken(user, ['*'], { expiresIn: '7 days' })
  }

  async destroy({ auth }: HttpContext) {
    await auth.use('api').invalidateToken()
  }

  async me({ auth }: HttpContext) {
    await auth.check()
    return auth.user
  }
}
