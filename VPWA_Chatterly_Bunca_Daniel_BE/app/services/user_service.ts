import User from '#models/user'
import State from '#models/state'

export default class UserService {
  async createNewUser(payload: any): Promise<User> {
    return await User.create({
      name: payload.name,
      surname: payload.surname,
      nickname: payload.nickname,
      emailAddress: payload.email,
      password: payload.password,
    })
  }

  async updateUser(user: User, payload: any): Promise<User> {
    if (
      payload.stateId !== undefined &&
      payload.stateId !== null &&
      (await State.findOrFail(payload.stateId)) &&
      user.stateId !== payload.stateId
    ) {
      user.stateId = payload.stateId
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
