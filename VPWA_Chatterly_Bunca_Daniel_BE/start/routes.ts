/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const UsersController = () => import('#controllers/users_controller')

router.post('api/auth/register', [UsersController, 'create'])
router.post('api/auth/login', [UsersController, 'login'])

router.get('/api/account', [UsersController, 'getAccount']).use([middleware.auth()])
router.patch('/api/account', [UsersController, 'updateAccount']).use([middleware.auth()])
