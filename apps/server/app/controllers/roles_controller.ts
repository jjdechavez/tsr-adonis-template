import { PaginateDto } from '#dto/paginate'
import { RoleDto } from '#dto/role'
import Role from '#models/role'
import type { HttpContext } from '@adonisjs/core/http'

export default class RolesController {
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const roles = await Role.query().paginate(page, limit)
    return response.ok({
      data: roles.all().map((role) => new RoleDto(role).toJson()),
      meta: new PaginateDto(roles.getMeta()).metaToJson(),
    })
  }
}
