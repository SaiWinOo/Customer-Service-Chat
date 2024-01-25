'use client';

import React, { useContext, useEffect, useState } from 'react';
import { Avatar, Box, Typography } from "@mui/material";
import axios from "axios";
import { usersApi } from "@/api/api";
import { useRouter } from "next/navigation";
import { AppContext } from "@/providers/AppProvider";
import moment from "moment";

const Users = ({ }) => {

    const [users, setUsers] = useState([]);
    const router = useRouter();
    const getUsers = async () => {
        let res = await axios.get(usersApi);
        setUsers(res.data.users);
    }

    const handleChangeChat = (user) => {
        router.push(`/chat/${user._id}`);
    }

    useEffect(() => {
        getUsers();
    }, [])


    return (
        <>
            {
                users.map(user => (
                    <Box onClick={() => handleChangeChat(user)} key={user._id} sx={{
                        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, padding: 2,
                        '&:hover': {
                            backgroundColor: '#00000020'
                        }
                    }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Avatar style={{ borderRadius: 5 }} src="https://images.unsplash.com/photo-1593085512500-5d55148d6f0d" />
                            <Box>
                                <Typography variant={'p'}>{user.name}</Typography>
                            </Box>
                        </Box>
                    </Box>
                ))
            }
        </>
    );
};

export default Users;
