import type { HttpContext } from '@adonisjs/core/http'
import UserService from '#services/user_service'
import { inject } from '@adonisjs/core'
import { createUserValidator } from '#validators/user'
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
}
