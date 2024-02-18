'use client';

import React, { useContext, useEffect } from 'react';
import { Controller, useForm } from "react-hook-form";
import Link from "next/link";
import { useMutation, useQuery } from "react-query";
import axios from "axios";
import { registerApi } from "@/api/api";
import { AppContext } from "@/providers/AppProvider";
import { useRouter } from "next/navigation";
import Button from "@/component/common/Button";

const Page = () => {
    const router = useRouter();
    const { token } = useContext(AppContext);
    const { control, handleSubmit } = useForm({
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
    const { mutate, isLoading, isError, error } = useMutation(register, {
        onSuccess: (data) => {
            localStorage.setItem('_token', data.data.token);
            localStorage.setItem('_user', JSON.stringify(data.data.user));
        },
        onError: (error) => {
            console.log(error.response.data.message);
        }
    });


    useEffect(() => {
        if (token) {
            return router.replace('/');
        }
    }, []);


    const onSubmit = (data) => {
        mutate(data);
    }
    return (
        <div
            className="h-full flex justify-center bg-secondary items-center ">
            <div onSubmit={handleSubmit(onSubmit)}
                className="w-[400px] bg-white p-5 rounded-md"
            >
                <h3 className="text-xl">Register</h3>
                {
                    isError && <p severity="error">{error.response.data.message}</p>
                }
                <Controller
                    control={control}
                    name='name'
                    render={({ field }) => (
                        <input {...field} placeholder="John Doe" />
                    )} />

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
                        <input  {...field} type={'password'} placeholder="********" />
                    )} />

                <Link href={'/login'}>
                    <p className="text-sm my-2 text-end text-gray-400">Already have an account? Login</p>
                </Link>
                <Button loading={isLoading} type={'submit'} >
                    Sign up
                </Button>
            </div>
        </div>
    );
};

export default Page;
