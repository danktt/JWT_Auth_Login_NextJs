
import Router from "next/router";
import { parseCookies, setCookie } from "nookies";
import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";


//#### interfaces ####

type User = {
  email: string;
  permissions: string[];
  roles: string[];
}

type SignInCredentials = {
  email: string;
  password: string;
}

type AuthContextData = {
  signIn(credentials : SignInCredentials) : Promise<void>;
  user: User;
  isAuthenticated: boolean;
}
type AuthProviderProps = {
  children: ReactNode;
}
//### Final Infertaces ###



export const AuthContext = createContext({} as AuthContextData ) 


export function AuthProvider({ children } :AuthProviderProps) {

  const [user, setUser ] = useState<User>()
  const isAuthenticated = !!user
  
  useEffect(()=> {
    const { "jwt.token": token} = parseCookies()
    
    if(token){
      api.get("/me").then(response => {
        const { email, permissions, roles } = response.data

        setUser({email, permissions, roles})
      })
    }
  },[])


  async function signIn({email, password} : SignInCredentials) {
    // Aqui vai a chamada de authenticate para a rota da api

    try {
      const response = await api.post('sessions', {
        email, 
        password
      })

      const { token, refreshToken , permissions, roles } = response.data

      setCookie(undefined, "jwt.token" , token ,{
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/'
      })
      setCookie(undefined, "jwt.refreshToken" , refreshToken,{
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/'
      })


      setUser({
        email,
        permissions,
        roles
      })

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      Router.push('/dashboard')
      
    }catch(err) {
      console.log( err)
    }


      
  }

  return(
    <AuthContext.Provider value={{isAuthenticated, signIn, user} as AuthContextData}>
      {children}
    </AuthContext.Provider>
  )
}