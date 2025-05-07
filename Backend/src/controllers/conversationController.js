// src/controllers/conversationController.js
const {
    listConversations,
    getMessageHistory,
    markAsRead
  } = require('../models/message.model');
  
  // GET /api/conversations
  exports.list = async (req, res) => {
    const me = req.user.uid;
    const convos = await listConversations(me);
    res.json(convos);
  };
  
  // GET /api/conversations/:withUserId/messages
  exports.history = async (req, res) => {
    const me = req.user.uid;
    const other = req.params.withUserId;
    const { limit, offset } = req.query;
    const msgs = await getMessageHistory(me, other, {
      limit: parseInt(limit,10)||10,
      offset: parseInt(offset,10)||0
    });
    res.json(msgs.reverse()); // de viejo→nuevo
  };
  
  // POST /api/conversations/:withUserId/read
  exports.markRead = async (req, res) => {
    const me = req.user.uid;
    const other = req.params.withUserId;
    await markAsRead(other, me);
    res.sendStatus(204);
  };
  