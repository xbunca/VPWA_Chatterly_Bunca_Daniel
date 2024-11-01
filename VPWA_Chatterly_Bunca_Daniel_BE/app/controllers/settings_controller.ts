import type { HttpContext } from '@adonisjs/core/http'
import State from '#models/state'

export default class SettingsController {
  async settings(context: HttpContext) {
    const userStates = await State.query().orderBy('id')
    const userStateJsons = []
    for (const userState of userStates) {
      userStateJsons.push(await userState.getJson())
    }
    const settingsJson = {
      userStates: userStateJsons,
    }
    return context.response.json(settingsJson)
  }
}
