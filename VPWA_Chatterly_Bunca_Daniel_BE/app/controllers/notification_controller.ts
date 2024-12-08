import { HttpContextContract } from '@adonisjs/Core/HttpContext'
import Subscription from 'App/Models/Subscription'
import webPush from 'web-push'

webPush.setVapidDetails(
  'mailto:your-email@example.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
)

export default class NotificationsController {
  public async subscribe({ request, response }: HttpContextContract) {
    const subscription = request.input('subscription')

    await Subscription.create({ subscription: JSON.stringify(subscription) })
    response.status(201).json({ message: 'Subscription saved.' })
  }

  public async notify({ request, response }: HttpContextContract) {
    const { title, body } = request.only(['title', 'body'])
    const subscriptions = await Subscription.all()

    const payload = JSON.stringify({ title, body })

    const promises = subscriptions.map(async (sub: { subscription: string }) => {
      const subscriptionData = JSON.parse(sub.subscription)
      try {
        await webPush.sendNotification(subscriptionData, payload)
      } catch (error) {
        console.error('Failed to send notification', error)
      }
    })

    await Promise.all(promises)
    response.status(200).json({ message: 'Notifications sent.' })
  }
}
