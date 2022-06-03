import Link from "next/link";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { api } from "../services/api";

export default function Dashboard() {

  const {user } = useContext(AuthContext)

  useEffect(()=> {
    api.get("/me").then(response=> {
      console.log(response)
    })
  },[])


  return ( 
    <>
    <h1>Dashboard</h1>
    <h2>{user?.email}</h2>
    <h2>{user?.permissions}</h2>
    <h2>{user?.roles}</h2>

    <Link href="/">Go to Login</Link>

    </>



   );
}



