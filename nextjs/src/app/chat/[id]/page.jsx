'use client';

import React, { useContext, useEffect, useRef, useState } from 'react';
import { Avatar, Box, IconButton, InputAdornment, OutlinedInput, TextField, Typography } from "@mui/material";
import { Send } from "@mui/icons-material";
import axios from "axios";
import { getOldMessagesApi, getSingleChatApi, goToChatApi, usersApi } from "@/api/api";
import { AppContext, socket } from "@/providers/AppProvider";
import EmojiPicker, { Emoji } from "emoji-picker-react";


const Page = ({ params }) => {

    const { id } = params;
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [chatUser, setChatUser] = useState({});
    const [conversation, setConversation] = useState({});

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
                divRef.current.scrollIntoView({ behavior: 'smooth' });
            }, 500);
        }
    }, [messages]);



    const ShowMessage = ({ message, index }) => {

        let isLastMessageForSender = messages[index + 1]?.sender._id !== message.sender._id;
        if (message.sender._id === user._id) {
            return (<Box
                sx={{
                    marginBottom: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    marginLeft: 'auto',
                    maxWidth: '85%',
                    position: 'relative',
                    justifyContent: 'flex-end',
                }}>
                <Typography sx={{
                    marginRight: 6,
                    borderBottomRightRadius: isLastMessageForSender ? 0 : 7,
                    borderBottomLeftRadius: 7,
                    boxShadow: 2,
                    borderTopRightRadius: 7,
                    borderTopLeftRadius: 7,
                    background: 'linear-gradient(to right bottom, #2870ea, #1b4aef)',
                    paddingRight: 2,
                    paddingLeft: 2,
                    paddingTop: 1,
                    paddingBottom: 1,
                    color: 'white'
                }}>{message.message}</Typography>
                {isLastMessageForSender ?
                    <Avatar sx={{ height: 30, width: 30, position: 'absolute', bottom: -10 }} src={message.sender.profile} />
                    : ''}
            </Box>)
        } else {
            return ((<Box
                sx={{
                    marginBottom: 1,
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    marginLeft: 'auto',
                    maxWidth: '100%',
                }}>
                {isLastMessageForSender ?
                    <Avatar sx={{ height: 30, width: 30, position: 'absolute', bottom: -10 }} src={message.sender.profile} />
                    : ''}
                <Typography sx={{
                    marginLeft: 6,
                    background: '#00000008',
                    paddingRight: 2,
                    borderBottomLeftRadius: isLastMessageForSender ? 0 : 7,
                    borderBottomRightRadius: 7,
                    boxShadow: 1,
                    borderTopRightRadius: 7,
                    borderTopLeftRadius: 7,
                    paddingLeft: 2,
                    paddingTop: 1,
                    paddingBottom: 1,
                    maxWidth: '85%'
                }}>{message.message} </Typography>

            </Box>))
        }
    }

    return (
        <Box sx={{ position: 'relative', height: '100%' }}>
            <Box sx={{ boxShadow: 2, width: '100%', height: '10%', display: 'flex', alignItems: 'center' }}>
                <Box sx={{ paddingLeft: 3 }}>
                    {chatUser?.name}
                </Box>
            </Box>
            <Box sx={{ overflow: 'scroll', height: '80vh', padding: 3, }}>
                {
                    messages.map((message, index) => <ShowMessage index={index} message={message} key={message._id} />)
                }
                <div ref={divRef} style={{ padding: '10px' }}></div>
            </Box>


            <Box component={'form'} onSubmit={sendMessage} sx={{ position: 'absolute', width: '100%', zIndex: 10 }}>


                <Box sx={{ position: 'absolute' }}>
                    <EmojiPicker onEmojiClick={(e) => console.log(e)} height={400} width={400} />
                </Box>

                <OutlinedInput onChange={e => setMessage(e.target.value)} sx={{ width: '90%', background: 'white', }}
                    size="small"
                    value={message ?? ''}
                    endAdornment={
                        <InputAdornment type={'submit'}
                            onClick={sendMessage}
                            position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                edge="end"
                            >
                                {'showPassword' ? <Send /> : <Send />}
                            </IconButton>

                        </InputAdornment>
                    }
                />
            </Box>
        </Box >
    );
};

export default Page;



