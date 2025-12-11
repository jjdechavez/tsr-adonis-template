import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const email = 'admin@acme.com'
    const admin = await User.findBy({
      email,
    })

    if (!admin) {
      await User.create({
        email,
        password: 'admin@Acme',
        firstName: 'Admin',
        lastName: 'Acme',
      })
    }
  }
}
