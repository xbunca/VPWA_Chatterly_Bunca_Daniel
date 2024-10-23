import vine from '@vinejs/vine'

export const createUserValidator = vine.compile(
  vine.object({
    name: vine.string().trim(),
    surname: vine.string().trim(),
    nickname: vine
      .string()
      .trim()
      .unique(async (db, value) => {
        const user = await db.from('users').where('nickname', value).first()
        return !user
      }),
    email: vine
      .string()
      .trim()
      .email()
      .unique(async (db, value) => {
        const user = await db.from('users').where('email_address', value).first()
        return !user
      }),
    password: vine.string().trim().minLength(8),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    username: vine.string().trim(),
    password: vine.string().trim().minLength(8),
  })
)
