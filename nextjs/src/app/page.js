'use client';


// import Users from "@/component/Users";
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
            router.replace('/');
        }

    }, [])
    return (
        <div>
            hello world welcome to chat
        </div>
    );
}
