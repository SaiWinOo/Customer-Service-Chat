import React, { useContext, useState } from 'react';
import { AppContext } from "@/providers/AppProvider";
import { useQuery } from "react-query";
import axios from "axios";
import { getCurrentUserApi } from "@/api/api";

const AuthProvider = ({ children }) => {

    const { setToken, setUser } = useContext(AppContext);

    const destroyAuth = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('_token');
        localStorage.removeItem('_user');
    }

    const { data } = useQuery('user', () => axios.get(getCurrentUserApi), {
        onSuccess: (data) => {
            setUser(data.data.user);
        },
        onError: error => {
            destroyAuth();
        }
    });


    return (
        <>
            {children}
        </>
    );
};

export default AuthProvider;
