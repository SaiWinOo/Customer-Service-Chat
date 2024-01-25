'use client';

import React, { useContext, useEffect, useState } from 'react';
import { Avatar, Box, Typography } from "@mui/material";
import axios from "axios";
import { getChatsApi, usersApi } from "@/api/api";
import { useRouter } from "next/navigation";
import { AppContext, socket } from "@/providers/AppProvider";
import moment from "moment";

const Conversations = ({ }) => {

  const [conversations, setConversations] = useState([]);
  const router = useRouter();
  const { user } = useContext(AppContext);

  console.log('fetching conversations');

  const getConversations = async () => {
    let res = await axios.get(getChatsApi);
    console.log(res.data.conversations);
    setConversations(res.data.conversations);
  }

  const handleChangeChat = (user) => {
    router.push(`/chat/${user._id}`);
  }

  useEffect(() => {
    getConversations();
  }, [])

  const getOtherUser = (users) => {
    let u = users.filter(u => u._id !== user._id);
    return u[0];
  }

  const reOrderChat = (newConversation) => {
    setConversations(pre => {
      let temp = pre.filter(c => c._id !== newConversation._id)
      return [newConversation, ...temp];
    })
  }
  const listenToMyRoom = () => {
    socket.on('chat-ordering' + user._id, data => {
      console.log(data);
      reOrderChat(data);
    })
  }

  useEffect(() => {
    listenToMyRoom();
  }, []);

  const Name = ({ conversation }) => {


    return <Typography variant={'p'}>{getOtherUser(conversation.participants)?.name}</Typography>
  }

  const Profile = ({ conversation }) => {
    return <Avatar style={{ borderRadius: 5 }} src={getOtherUser(conversation.participants)?.profile} />;
  }
  return (
    <>
      {
        conversations.map(conversation => (
          <Box onClick={() => handleChangeChat(conversation)} key={conversation._id} sx={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, padding: 2,
            '&:hover': {
              backgroundColor: '#00000020'
            }
          }}>
            <Box sx={{ display: 'flex', gap: 2 }}>

              <Profile conversation={conversation} />
              <Box>
                <Name conversation={conversation} />
                <Typography variant={'body2'} color={'gray'}>{conversation.latestMessage?.message?.substring(0, 30)}...</Typography>
              </Box>
            </Box>
            <Box>
              <Typography variant={'body2'} color={'gray'}>{moment(conversation.latestMessage?.createdAt).fromNow()}</Typography>
            </Box>
          </Box>
        ))
      }
    </>
  );
};

export default Conversations;
