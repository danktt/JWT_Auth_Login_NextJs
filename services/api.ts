// Criação da chamada a api
import axios, { AxiosError } from "axios";
import { parseCookies, setCookie } from "nookies";




let cookies = parseCookies()
let isRefreshing = false
let failedRequestsQueue = [] as any 


export const api = axios.create({
  baseURL: "http://localhost:3333",
  headers: {
    Authorization: `Bearer ${cookies["jwt.token"]}`
  }
})  


api.interceptors.response.use(response => {
  return response;
}, (error : AxiosError | any) => {
  if (error.response.status === 401){
    if(error.response.data?.code == "token.expired"){
      cookies = parseCookies()
      const {"jwt.refreshToken": refreshToken } = cookies

      const originalConfig = error.config

      if(!isRefreshing){
        isRefreshing = true
        api.post("/refresh", {
          refreshToken,
        }).then(response => {
          const { token } = response.data
  
          setCookie(undefined, "jwt.token" , token ,{
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: '/'
          })
          setCookie(undefined, "jwt.refreshToken" , response.data.refreshToken,{
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: '/'
          })
    
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  

          failedRequestsQueue.forEach((request : Request) => request.onSuccess(token))
          failedRequestsQueue = []
        }).catch(err => {
          failedRequestsQueue.forEach((request : Request) => request.onFailure(err) )
          failedRequestsQueue = []
        }).finally(() => {
          isRefreshing = false
        })
      }

      return new Promise((resolver, reject)=> {
        failedRequestsQueue.push({
          onSuccess: (token: string) => {
            originalConfig.headers["Authorization"] = `Bearer ${token}`
          
            resolver(api(originalConfig))
          },
          onFailure: (error: AxiosError) => {
            reject(error)
          }
        })
      })
    } else {  

    }
  }
})