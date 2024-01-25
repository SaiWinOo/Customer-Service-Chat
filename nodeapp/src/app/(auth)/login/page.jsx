'use client';

import React, {useContext, useEffect} from 'react';
import {Alert, Button, CircularProgress, LinearProgress, Stack, TextField, Typography} from "@mui/material";
import {Controller, useForm} from "react-hook-form";
import Link from "next/link";
import {useMutation} from "react-query";
import axios from "axios";
import {loginApi} from "@/api/api";
import {AppContext} from "@/providers/AppProvider";
import {useRouter} from "next/navigation";

const Page = () => {

    const {token} = useContext(AppContext);
    const router = useRouter();

    const {control, handleSubmit} = useForm({
        defaultValues : {
            email : '',
            password : '',
        }
    });

    const login = (data) => {
        return axios.post(loginApi, data);
    }
    const {error,isError,isLoading,mutate} = useMutation(login,{
        onSuccess : (data) => {
            localStorage.setItem('_user',JSON.stringify(data.data.user));
            localStorage.setItem('_token',data.data.token);
        }
    });

    useEffect(() => {
        if(token){
            return router.replace('/');
        }
    }, []);

    const onSubmit = (data) => {
        mutate(data);
    }
    return (
        <Stack flexDirection={'row'} justifyContent={'center'} height={'100vh'} alignItems={'center'}>
            <Stack onSubmit={handleSubmit(onSubmit)} component={'form'} minWidth={{xs: 300, sm: 500}} flexDirection={'column'} gap={2} boxShadow={2}
                   padding={5} textAlign={'center'}>
                <Typography variant={'h5'} marginBottom={3}>Login</Typography>
                {isError && <Alert>{error.response.data.message}</Alert>}
                <Controller
                    control={control}
                    name='email'
                    render={({field}) => (
                        <TextField {...field} label={'Email'} variant={'outlined'} size={'small'}/>
                    )}/>

                <Controller
                    control={control}
                    name='password'
                    render={({field}) => (
                        <TextField  {...field} type={'password'} label={'Password'} variant={'outlined'} size={'small'}/>
                    )}/>

                <Link href={'/register'}>
                    <Typography textAlign={'end'} >Don't have an account? Register</Typography>
                </Link>
                <Button type={'submit'} variant={'contained'}>
                    {isLoading ? <CircularProgress color={'warning'} size={25}/> : 'Login'}
                </Button>
            </Stack>
        </Stack>
    );
};

export default Page;
