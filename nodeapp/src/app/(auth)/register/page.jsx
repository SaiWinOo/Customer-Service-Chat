'use client';

import React, {useContext, useEffect} from 'react';
import {Alert, Button, CircularProgress, LinearProgress, Stack, TextField, Typography} from "@mui/material";
import {Controller, useForm} from "react-hook-form";
import Link from "next/link";
import {useMutation, useQuery} from "react-query";
import axios from "axios";
import {registerApi} from "@/api/api";
import {AppContext} from "@/providers/AppProvider";
import {useRouter} from "next/navigation";

const Page = () => {
    const router = useRouter();
    const {token} = useContext(AppContext);
    const {control, handleSubmit} = useForm({
        defaultValues: {
            name: '',
            email: '',
            password: '',
        }
    });

    const register = (data) => {
        console.log(data);
        return axios.post(registerApi, data);
    }
    const {mutate, isLoading,isError,error} = useMutation(register, {
        onSuccess: (data) => {
            localStorage.setItem('_token', data.data.token);
            localStorage.setItem('_user', JSON.stringify(data.data.user));
        },
        onError: (error)=> {
            console.log(error.response.data.message);
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
            <Stack onSubmit={handleSubmit(onSubmit)} component={'form'} minWidth={{xs: 300, sm: 500}}
                   flexDirection={'column'} gap={2} boxShadow={2}
                   padding={5} textAlign={'center'}>
                <Typography variant={'h5'} marginBottom={3}>Register</Typography>
                {
                    isError && <Alert severity="error">{error.response.data.message}</Alert>
                }
                <Controller
                    control={control}
                    name='name'
                    render={({field}) => (
                        <TextField {...field} label={'Name'} variant={'outlined'} size={'small'}/>
                    )}/>

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
                        <TextField  {...field} type={'password'} label={'Password'} variant={'outlined'}
                                    size={'small'}/>
                    )}/>

                <Link href={'/login'}>
                    <Typography textAlign={'end'}>Already have an account? Login</Typography>
                </Link>
                <Button type={'submit'} variant={'contained'}>
                    {
                        isLoading ? <CircularProgress color={'warning'} size={25}/> : 'Register'
                    }
                </Button>
            </Stack>
        </Stack>
    );
};

export default Page;
