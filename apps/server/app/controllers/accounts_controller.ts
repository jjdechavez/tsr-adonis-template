import { UserDto } from '#dto/user'
import { updateAccountValidator } from '#validators/account'
import type { HttpContext } from '@adonisjs/core/http'

export default class AccountsController {
  async update({ auth, request }: HttpContext) {
    const payload = await request.validateUsing(updateAccountValidator)

    const user = auth.user!

    user.merge(payload)
    await user.save()

    await user.load('role')

    return new UserDto(user).toJson()
  }
}
