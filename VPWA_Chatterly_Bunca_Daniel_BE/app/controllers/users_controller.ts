import type { HttpContext } from '@adonisjs/core/http'
import UserService from '#services/user_service'
import { inject } from '@adonisjs/core'

@inject()
export default class UsersController {
  constructor(
    private userService: UserService
  ) {}

  create(context: HttpContext) {
    console.log(context)
    this.userService.createNewUser()
  }
}
