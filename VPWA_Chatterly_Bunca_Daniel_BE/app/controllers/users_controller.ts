import type { HttpContext } from '@adonisjs/core/http'
import UserService from '#services/user_service'
import { inject } from '@adonisjs/core'
import { createUserValidator, loginValidator } from '#validators/user'
import User from '#models/user'

@inject()
export default class UsersController {
  constructor(private userService: UserService) {}

  async create(context: HttpContext) {
    const payload = await context.request.validateUsing(createUserValidator)
    const user = await this.userService.createNewUser(payload)
    const token = await User.accessTokens.create(user)

    return context.response.json({
      access_token: token.value!.release(),
    })
  }

  async login(context: HttpContext) {
    const payload = await context.request.validateUsing(loginValidator)
    const user = await User.verifyCredentials(payload.username, payload.password)
    const token = await User.accessTokens.create(user)

    return context.response.json({
      access_token: token.value!.release(),
    })
  }

  async getAccount(context: HttpContext) {
    const auth = context.auth
    await auth.authenticate()
    const user = context.auth.getUserOrFail()
    return context.response.json(await user.getAccountJson())
  }
}
