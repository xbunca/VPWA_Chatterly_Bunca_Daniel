import User from '#models/user'
import State from '#models/state'
import { HttpException } from '#exceptions/http_exception'

export default class UserService {
  async createNewUser(payload: any): Promise<User> {
    return await User.create({
      name: payload.name,
      surname: payload.surname,
      nickname: payload.nickname,
      emailAddress: payload.email,
      password: payload.password,
      stateId: 1,
    })
  }

  async updateUser(user: User, payload: any): Promise<User> {
    try {
      if (
        payload.stateId !== undefined &&
        payload.stateId !== null &&
        (await State.findOrFail(payload.stateId)) &&
        user.stateId !== payload.stateId
      ) {
        user.stateId = payload.stateId
      }
    } catch (e) {
      throw new HttpException(404, 'State not found')
    }

    if (
      payload.notifyMentionsOnly !== undefined &&
      payload.notifyMentionsOnly !== null &&
      payload.notifyMentionsOnly !== user.notifyMentionsOnly
    ) {
      user.notifyMentionsOnly = payload.notifyMentionsOnly
    }

    return user.save()
  }
}
