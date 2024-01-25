'use client';

import React, { createContext, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from "react-query";
import axios from "axios";
import AuthProvider from "@/providers/AuthProvider";
import { io } from "socket.io-client";
import { useRouter } from "next/navigation";

axios.defaults.baseURL = 'http://localhost:8000';


export const socket = io('http://localhost:8000');
export const AppContext = createContext();
const AppProvider = ({ children }) => {

    const queryClient = new QueryClient();
    const router = useRouter();

    const [loading, setLoading] = useState(true);

    // const [token, setToken] = useState(localStorage.getItem('_token') || null);
    // const [user, setUser] = useState(localStorage.getItem('_user') || null);

    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (!localStorage.getItem('_token')) {
            router.replace('/login');
        }
        setToken(localStorage.getItem('_token'));
        setUser(JSON.parse(localStorage.getItem('_user')));
        setTimeout(() => {
            setLoading(false);
        }, 500)
    }, []);

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;


    return (
        <>
            {
                !loading &&
                <QueryClientProvider client={queryClient}>
                    <AppContext.Provider value={{ token, setToken, user, setUser }}>
                        <AuthProvider>
                            {children}
                        </AuthProvider>
                    </AppContext.Provider>
                </QueryClientProvider>
            }
        </>
    );
};

export default AppProvider;
