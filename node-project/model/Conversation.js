const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
  participants: [
    { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }
  ],
  latestMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
}, {
  timestamps: true
}
)

module.exports = mongoose.model('Conversation', ConversationSchema);