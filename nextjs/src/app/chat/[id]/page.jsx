'use client';

import React, { useContext, useEffect, useRef, useState } from 'react';

import axios from "axios";
import { getOldMessagesApi, getSingleChatApi, goToChatApi, usersApi } from "@/api/api";
import { AppContext, socket } from "@/providers/AppProvider";
import EmojiPicker, { Emoji } from "emoji-picker-react";
import Typing from "@/component/Typing";
import moment from "moment";
import { BsEmojiSmile } from "react-icons/bs";
import { CgAttachment } from "react-icons/cg";



const Page = ({ params }) => {

    const { id } = params;
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [chatUser, setChatUser] = useState({});
    const [conversation, setConversation] = useState({});
    const [showEmoji, setShowEmoji] = useState(false);

    const divRef = useRef(null);

    const { user } = useContext(AppContext);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!message) {
            return;
        }
        socket.emit('send', {
            receiver: chatUser._id,
            message,
            sender: user._id,
            conversation_id: id,
        });
        setMessage('');
    }


    const getOldMessages = async () => {
        try {
            let res = await axios.get(`${getOldMessagesApi}/${id}?limit=100`);
            setMessages(res.data.messages);
        } catch (e) {
            console.log(e);
        }
    }

    const fetchConversation = async () => {
        try {
            let res = await axios.get(getSingleChatApi + '/' + id);
            let data = res.data.conversation;
            data.participants.map(p => {
                if (p._id !== user._id) {
                    setChatUser(p);
                }
            })
            setConversation(data);
        } catch (error) {
            console.log(error);
        }
    }

    const joinRoom = () => {
        socket.emit('join_room', user._id);
    }

    const listenToMyRoom = () => {
        socket.on(user._id, data => {
            if (data.conversation_id === id) {
                setMessages(pre => [...pre, data]);
            }
        })
    }
    useEffect(() => {
        fetchConversation();
        joinRoom();
        listenToMyRoom();
    }, []);

    useEffect(() => {
        if (chatUser._id) {
            getOldMessages();
        }
    }, [chatUser])

    useEffect(() => {
        if (divRef.current) {
            setTimeout(() => {
                divRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 500);
        }
    }, [messages]);

    const ShowMessage = ({ message, index }) => {

        let isLastMessageForSender = messages[index + 1]?.sender._id !== message.sender._id;
        if (message.sender._id === user._id) {
            return (<div
                className={`mb-2 flex items-center gap-2 ml-auto max-w-[85%] relative justify-end`}
            >
                <div className="mr-10 flex flex-col  items-end">
                    <p
                        className={` rounded-lg  shadow-lg bg-primary px-4 py-2.5 text-white`}
                    >{message.message}</p>
                    <p className="text-gray-400 text-[10px]">{moment(message.createdAt).calendar()}</p>
                </div>

                {isLastMessageForSender ?
                    <img
                        className="h-[30px] w-[30px] absolute bottom-0 rounded-full"
                        src={message.sender.profile} />
                    : ''}
            </div>)
        } else {
            return ((<div
                className="mb-2 relative flex items-center ml-auto gap-3 max-w-full "
            >
                {isLastMessageForSender ?
                    <img
                        className="h-[30px] w-[30px] absolute bottom-0 rounded-full"
                        src={message.sender.profile} />
                    : ''}
                <div className="flex flex-col items-start ml-10">
                    <p
                        className=" bg-white rounded-lg px-4 py-2.5 max-w-[85%]"
                    >{message.message} </p>
                    <p className="text-gray-400 text-[10px]">{moment(message.createdAt).calendar()}</p>
                </div>
            </div>))
        }
    }

    const handleAddEmoji = (e) => {
        setMessage(pre => pre + e.emoji);
        setShowEmoji(false);
    }

    return (
        <div className=' h-[100vh] col-span-full lg:col-span-9' >
            <div className="h-[7%] bg-white  flex justify-start items-center">
                <h4 className="  pl-4  text-lg">
                    {chatUser.name}
                </h4>
            </div>
            <div className="overflow-scroll bg-secondary relative h-[93%] p-5" >
                {
                    messages.map((message, index) => <ShowMessage index={index} message={message} key={message._id} />)
                }

                <div className="flex items-end gap-3">
                    <img src={'https://plus.unsplash.com/premium_photo-1675827055694-010aef2cf08f'} className="rounded-full w-[30px] h-[30px]" alt="" />
                    <Typing />
                </div>

                <div ref={divRef} className="p-10" ></div>

            </div>

            <div onSubmit={sendMessage} className="fixed  rounded-lg w-[92%] lg:w-[72%] bg-white  z-10 bottom-3 m-5 flex items-center justify-between" >
                {
                    showEmoji &&
                    <div className="absolute bottom-[-5%] right-[3%]" >
                        <EmojiPicker onEmojiClick={handleAddEmoji} height={400} width={400} />
                    </div>
                }
                <input type="text"
                    className="!w-full rounded-lg p-3 my-0 border-0"
                    value={message ?? ''}
                    placeholder="Type a message"
                    onChange={e => setMessage(e.target.value)}
                />
                <div className="pr-4 flex gap-3 text-gray-400">
                    <CgAttachment className="cursor-pointer" />
                    <BsEmojiSmile onClick={() => setShowEmoji(!showEmoji)} className="cursor-pointer" />
                </div>
            </div>
        </div >
    );
};

export default Page;



