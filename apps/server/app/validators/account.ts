import vine from '@vinejs/vine'

export const updateAccountValidator = vine.compile(
  vine.object({
    firstName: vine.string().maxLength(180).optional(),
    lastName: vine.string().maxLength(180).optional(),
  })
)
