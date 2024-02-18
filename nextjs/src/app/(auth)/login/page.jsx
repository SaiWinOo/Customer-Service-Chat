'use client';

import React, { useContext, useEffect } from 'react';
import { Controller, useForm } from "react-hook-form";
import Link from "next/link";
import { useMutation } from "react-query";
import axios from "axios";
import { loginApi } from "@/api/api";
import { AppContext } from "@/providers/AppProvider";
import { useRouter } from "next/navigation";
import Button from "@/component/common/Button";

const Page = () => {

    const { token, setToken, setUser } = useContext(AppContext);
    const router = useRouter();

    const { control, handleSubmit } = useForm({
        defaultValues: {
            email: '',
            password: '',
        }
    });

    const login = (data) => {
        return axios.post(loginApi, data);
    }
    const { error, isError, isLoading, mutate } = useMutation(login, {
        onSuccess: (data) => {
            localStorage.setItem('_user', JSON.stringify(data.data.user));
            localStorage.setItem('_token', data.data.token);
            setUser(data.data.user);
            setToken(data.data.token);
            setTimeout(() => {
                router.push('/chat');
            }, 500);
        }
    });

    useEffect(() => {
        if (token) {
            return router.replace('/');
        }
    }, []);

    const onSubmit = (data) => {
        console.log(data);
        mutate(data);
    }
    return (
        <div className="flex justify-center bg-secondary items-center h-full" >
            <form
                className="w-[400px] bg-white p-5 rounded-md"
                onSubmit={handleSubmit(onSubmit)}
            >
                <p className="text-xl ">Login</p>
                {isError && <p>{error.response.data.message}</p>}
                <Controller
                    control={control}
                    name='email'
                    render={({ field }) => (
                        <input {...field} placeholder="example@gmail.com" />
                    )} />

                <Controller
                    control={control}
                    name='password'
                    render={({ field }) => (
                        <input  {...field} type={'password'} placeholder="*******" />
                    )} />

                <Link href={'/register'}  >
                    <p className="text-sm my-2 text-end text-gray-400" >Don't have an account? Register</p>
                </Link>

                <Button type={'submit'} loading={isLoading} >
                    Login
                </Button>
            </form>
        </div >
    );
};

export default Page;
