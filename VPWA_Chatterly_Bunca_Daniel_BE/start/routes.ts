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
const ChatRoomsController = () => import('#controllers/chat_rooms_controller')

router.post('/api/auth/register', [UsersController, 'create'])
router.post('/api/auth/login', [UsersController, 'login'])
router.post('/api/auth/logout', [UsersController, 'logout']).use([middleware.auth()])

router.get('/api/account', [UsersController, 'getAccount']).use([middleware.auth()])
router.patch('/api/account', [UsersController, 'updateAccount']).use([middleware.auth()])

router.post('/api/chatRoom', [ChatRoomsController, 'create']).use([middleware.auth()])
router
  .post('/api/chatRoom/:chatId/invite/:invitedUserNickname', [ChatRoomsController, 'invite'])
  .use([middleware.auth()])
router.get('/api/chatRoom/invite', [ChatRoomsController, 'getInvitations']).use([middleware.auth()])
router
  .patch('/api/chatRoom/invite/:invitationId', [ChatRoomsController, 'invitationResponse'])
  .use([middleware.auth()])
router.post('/api/chatRoom/:chatRoomName', [ChatRoomsController, 'join']).use([middleware.auth()])
router.get('/api/chatRoom', [ChatRoomsController, 'getChatRooms']).use([middleware.auth()])
router
  .delete('/api/chatRoom/:chatRoomId/leave', [ChatRoomsController, 'leave'])
  .use([middleware.auth()])
