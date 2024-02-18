'use client';


import { usersApi } from "@/api/api";
import Conversations from "@/component/Conversations";
import Users from "@/component/Users";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function RootLayout({ children }) {


  const pathname = usePathname();
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);


  const fetchUsers = async () => {
    try {
      let res = await axios.get(usersApi + `?search=${search}`);
      console.log(res.data.users);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, [search])

  return (

    <div className="grid h-full grid-cols-12">
      <div className="col-span-3">
        <div className="px-5 ">
          <input value={search} onChange={e => setSearch(e.target.value)} className="rounded-full px-5" placeholder="Search users" />
        </div>
        {
          search ?
            <Users users={users} /> :
            <Conversations />
        }
      </div>
      {children}
    </div>
  );
}
