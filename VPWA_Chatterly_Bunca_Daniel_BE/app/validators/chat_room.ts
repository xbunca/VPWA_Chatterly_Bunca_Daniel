import vine from '@vinejs/vine'

export const createChatRoomValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .trim()
      .unique(async (db, value) => {
        const chatRoom = await db.from('chat_rooms').where('name', value).first()
        return !chatRoom
      }),
    private: vine.boolean(),
  })
)
