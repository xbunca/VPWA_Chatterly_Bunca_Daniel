import type { HttpContext } from '@adonisjs/core/http'
import UserService from '#services/user_service'
import { inject } from '@adonisjs/core'
import { createUserValidator, loginValidator, updateAccountValidator } from '#validators/user'
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

  async logout(context: HttpContext) {
    const user = context.auth.getUserOrFail()
    const token = user.currentAccessToken
    await User.accessTokens.delete(user, token.identifier)
    return context.response.json({})
  }

  async getAccount(context: HttpContext) {
    const user = context.auth.getUserOrFail()
    return context.response.json(await user.getJson())
  }

  async updateAccount(context: HttpContext) {
    const user = context.auth.getUserOrFail()
    const payload = await context.request.validateUsing(updateAccountValidator)
    const updatedUser = await this.userService.updateUser(user, payload)
    return context.response.json(await updatedUser.getJson())
  }
}
