'use client';

import { goToChatApi, usersApi } from "@/api/api";
import { Avatar, Button, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from 'react'

const page = () => {

  const router = useRouter();
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    let res = await axios.get(usersApi);
    setUsers(res.data.users);
  }

  useEffect(() => {
    getUsers();
  }, [])

  const goToChat = async (id) => {
    let res = await axios.post(goToChatApi + '/' + id);
    console.log(res.status);
    if (res.status === 200) {
      router.push(`/chat/${res.data?.conversation._id}`)
      router.refresh();
    }
    console.log(res.data.conversation);
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', }}>

      <Box sx={{ width: { xs: '100%', md: '50%' }, padding: 10 }} >
        <TextField sx={{ width: '100%', marginBottom: 3 }} size="small" />
        <Box>
          {
            users.map(user => (
              <Box key={user._id} sx={{
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
                <Button onClick={() => goToChat(user._id)}>
                  Go to chat
                </Button>
              </Box>
            ))
          }
        </Box>

      </Box>

    </Box>
  )
}

export default page;