import User from '#models/user'

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
}
