import { InviteDto } from '#dto/invite'
import { PaginateDto } from '#dto/paginate'
import { InviteService } from '#services/invite_service'
import env from '#start/env'
import {
  completeInviteValidator,
  createInviteValidator,
  updateInviteValidator,
} from '#validators/invite'
import { inject } from '@adonisjs/core'
import { type HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'

@inject()
export default class InvitesController {
  constructor(protected inviteService: InviteService) {}

  async store({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(createInviteValidator)
    const created = await this.inviteService.create({ ...payload, invitedById: auth!.user!.id })
    return response.created(new InviteDto(created!).toJson())
  }

  async index({ request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const qs = request.qs()
    const invites = await this.inviteService.paginate(page, limit, qs)

    return {
      data: invites.all().map((invite) => new InviteDto(invite).toJson()),
      meta: new PaginateDto(invites.getMeta()).metaToJson(),
    }
  }

  generateLink({ params, request }: HttpContext) {
    const host = request.hostname()! || env.get('HOST')
    const beURL =
      env.get('NODE_ENV') !== 'production'
        ? `${env.get('HOST')}:${env.get('PORT')}`
        : `https://${host}`
    const link = router
      .builder()
      .prefixUrl(beURL)
      .params({ id: params.id })
      .makeSigned('invites.confirm', { expiresIn: '3 days' })

    return { link }
  }

  async confirm({ request, params, response }: HttpContext) {
    const isValidSignature = request.hasValidSignature()
    const id = params.id
    const result = await this.inviteService.confirm(id, isValidSignature)

    if (result.status !== 'confirmed') {
      return response.badRequest(result)
    }

    const feConfirmRoute = router
      .builder()
      .prefixUrl(env.get('FE_URL'))
      .disableRouteLookup()
      .params({ id: id })
      .makeSigned('/invites/:id/confirm')

    return response.redirect().toPath(feConfirmRoute)
  }

  async show({ params, response }: HttpContext) {
    const invite = await this.inviteService.findById(params.id)

    if (!invite) {
      return response.notFound({ message: `Invite not found with ${params.id} ID` })
    }

    return new InviteDto(invite).toJson()
  }

  async complete({ request, params, response }: HttpContext) {
    const payload = await request.validateUsing(completeInviteValidator)
    const result = await this.inviteService.complete(params.id, payload)

    if (result.status === 'not_found') {
      return response.notFound({ message: `Invite not found with ${params.id} ID` })
    }

    return response.created()
  }

  async update({ request, params, response }: HttpContext) {
    const payload = await request.validateUsing(updateInviteValidator, {
      meta: { inviteId: params.id },
    })
    const result = await this.inviteService.update(params.id, payload)

    if (result.status === 'not_found') {
      return response.notFound({ message: result.message })
    }

    return response.ok(new InviteDto(result.data).toJson())
  }
}
