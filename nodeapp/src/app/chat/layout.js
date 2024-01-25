'use client';


import Conversations from "@/component/Conversations";
import Users from "@/component/Users";
import { Grid } from "@mui/material";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {


  const pathname = usePathname();

  return (
    <>
      {
        pathname === '/chat' ?
          <>
            {children}
          </>
          :
          <>
            <Grid container>

              <Grid padding={2} item xs={4} sx={{ borderRight: 1, borderColor: '#00000020' }}>
                <Conversations />
              </Grid>
              <Grid item xs={8}>
                {children}
              </Grid>
            </Grid>
          </>
      }
    </>

  );
}
