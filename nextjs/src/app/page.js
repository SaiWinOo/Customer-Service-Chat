'use client';


import { Avatar, Box, Button, Divider, Grid, Stack, Typography } from "@mui/material";
import Users from "@/component/Users";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "@/providers/AppProvider";
import { useRouter } from "next/navigation";

export default function Home() {

    const { token } = useContext(AppContext);
    const router = useRouter();

    useEffect(() => {
        if (!token) {
            router.replace('/login');
        } else {
            router.replace('/chat');
        }

    }, [])
    return (
        <Grid container height={'100vh'} >
            {/* <Grid padding={2} item xs={4} sx={{ borderRight: 1, borderColor: '#00000020' }}>
                <Users selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
            </Grid>
            <Grid item xs={8}>
                <Chat selectedUser={selectedUser} />
            </Grid> */}
        </Grid>
    );
}
