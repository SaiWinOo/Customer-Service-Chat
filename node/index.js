require('dotenv').config();
const express = require('express');
const { default: mongoose } = require("mongoose");
const { db } = require('./config/database');
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/message');
const userRoutes = require('./routes/user');
const conversationRoutes = require('./routes/conversation');
const auth = require('./middleware/auth');
const cors = require('cors');
const { Server } = require("socket.io");
const Message = require("./model/Message");
const User = require("./model/User");
const Conversation = require("./model/Conversation");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: '*',
}))

const PORT = process.env.PORT || 4000;


app.use('/auth', authRoutes)
app.use('/users', auth.verifyUserToken, userRoutes);
app.use('/message', auth.verifyUserToken, messageRoutes);
app.use('/chat', auth.verifyUserToken, conversationRoutes);

app.get('/', (req, res) => {
  return res.json({ message: 'hello world' })
})

mongoose.connect(db, {
}).then(res => {
  console.log('Mongo connected')
  let expressServer = app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });

  let io = new Server(expressServer, {
    cors: {
      origin: '*'
    }
  })
  io.on('connection', socket => {
    console.log('connected');

    socket.on('disconnect', data => {
      console.log('Someone disconnect', data);
    })
    socket.on('join_room', userID => {
      socket.join(userID)
      console.log('joining room ', userID);
    })
    socket.on('send', async (data) => {
      console.log(data);
      let newMessage = await Message.create(data);

      newMessage = await Message.findById(newMessage._id)
        .populate('sender', 'name profile email _id')
        .populate('receiver', 'name profile email _id')
        .exec();

      await Conversation.findByIdAndUpdate(data.conversation_id, {
        latestMessage: newMessage._id,
        updatedAt: Date.now(),
      }).exec();

      let newConversation = await Conversation.findById(data.conversation_id)
        .populate('participants')
        .populate('latestMessage')
        .exec();

      io.to(data.receiver).emit(data.receiver, newMessage);
      io.to(data.sender).emit(data.sender, newMessage);

      io.to(data.receiver).emit('chat-ordering' + data.receiver, newConversation);
      io.to(data.sender).emit('chat-ordering' + data.sender, newConversation);
    })

  })

})
  .catch(error => console.log(error))




