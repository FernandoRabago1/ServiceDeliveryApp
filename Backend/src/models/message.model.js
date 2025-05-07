// src/models/message.model.js
const { User, Message, Sequelize } = require('./index');
const { Op } = Sequelize;

// 1) Guarda un mensaje nuevo
async function saveMessage({ senderId, receiverId, body }) {
  const [sender, receiver] = await Promise.all([
    User.findByPk(senderId),
    User.findByPk(receiverId)
  ]);
  if (!sender || !receiver) {
    const e = new Error('Sender or receiver not found');
    e.statusCode = 404;
    throw e;
  }
  return Message.create({ senderId, receiverId, body });
}

// 2) Lista de conversaciones: con quién has hablado, último mensaje, fecha y no leídos

async function listConversations(userId) {
    const rows = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      attributes: [
        // ¿con quién hablo?
        [
          Sequelize.literal(`
            CASE
              WHEN "Message"."sender_id" = '${userId}' THEN "Message"."receiver_id"
              ELSE "Message"."sender_id"
            END
          `),
          'withUser'
        ],
        // Fecha del último mensaje
        [ Sequelize.fn('MAX', Sequelize.col('created_at')), 'lastAt' ],
        // UUID del mensaje más reciente (array_agg ordenado desc y [1])
        [
          Sequelize.literal(`(array_agg("Message"."id" ORDER BY "created_at" DESC))[1]`),
          'lastMsgId'
        ]
      ],
      group: ['withUser']
    });
  
    // Ahora por cada interlocutor traemos el mensaje, el usuario y el conteo de no leídos
    return Promise.all(rows.map(async r => {
      const withUser = r.get('withUser');
      const lastAt   = r.get('lastAt');
      const lastMsg  = await Message.findByPk(r.get('lastMsgId'));
      const unread   = await Message.count({
        where: { senderId: withUser, receiverId: userId, isRead: false }
      });
      const user = await User.findByPk(withUser, { attributes: ['uid','name'] });
      return { withUser, user, last: lastMsg, lastAt, unread };
    }));
  }

// 3) Historial paginado (descendente, luego lo das vuelta en el controlador)
async function getMessageHistory(userA, userB, { limit = 10, offset = 0 }) {
  return Message.findAll({
    where: {
      [Op.or]: [
        { senderId: userA, receiverId: userB },
        { senderId: userB, receiverId: userA }
      ]
    },
    order: [['created_at', 'DESC']],
    limit,
    offset
  });
}

// 4) Marca como leídos todos los mensajes entrantes de B → A
async function markAsRead(senderId, receiverId) {
  await Message.update(
    { isRead: true },
    { where: { senderId, receiverId, isRead: false } }
  );
}

module.exports = {
  saveMessage,
  listConversations,
  getMessageHistory,
  markAsRead
};
