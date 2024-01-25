const Conversation = require('../model/Conversation');


const getSingleChat = async (req, res) => {
  let conversation = await Conversation.findOne({ _id: req.params.id })
    .populate('participants', 'name profile email _id')
    .populate('latestMessage')
    .exec();
  return res.json({ conversation });
}


const createOrReturnChat = async (req, res) => {
  console.log(req.user);
  let conversation = await Conversation.findOne({ participants: { $all: [req.user.id, req.params.id] } }).exec();
  if (!conversation) {
    conversation = await Conversation.create({
      participants: [req.user.id, req.params.id],
    });
  }
  return res.json({ conversation })
}

const getMyChats = async (req, res) => {
  let conversations = await Conversation.find({ participants: { $in: [req.user.id] } })
    .populate('latestMessage')
    .populate('participants', 'name email _id profile')
    .sort('-updatedAt')
    .exec();

  return res.json({ conversations })
}
module.exports = {
  createOrReturnChat,
  getMyChats,
  getSingleChat
}