'use client';

import React, { useContext, useEffect, useState } from 'react';
import axios from "axios";
import { getChatsApi, usersApi } from "@/api/api";
import { useRouter } from "next/navigation";
import { AppContext, socket } from "@/providers/AppProvider";
import moment from "moment";

const Conversations = ({ }) => {

  const [conversations, setConversations] = useState([]);
  const router = useRouter();
  const { user } = useContext(AppContext);


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
    return <p >{getOtherUser(conversation.participants)?.name}</p>
  }

  const Profile = ({ conversation }) => {
    return <img className="rounded-full w-[50px] h-[50px] " src={getOtherUser(conversation.participants)?.profile} />;
  }

  return (
    <div className="w-full border-r hidden lg:block">
      {
        conversations.map(conversation => (
          <div onClick={() => handleChangeChat(conversation)} key={conversation._id}
            className="flex items-start justify-between gap-4 p-2 mb-2 px-5 hover:bg-gray-100"
          >
            <div className="flex gap-4" >
              <Profile conversation={conversation} />
              <div>
                <Name conversation={conversation} />
                <p className="text-gray-400 text-[13px]">{conversation.latestMessage?.message?.substring(0, 30)}...</p>
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-[12px]" >{moment(conversation.latestMessage?.createdAt).fromNow()}</p>
            </div>
          </div>
        ))
      }
    </div>
  );
};

export default Conversations;
