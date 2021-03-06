import Head from 'next/head'
import { FormEvent, useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import styles from '../styles/Home.module.css'

export default function Home(){

  const [email, setEmail] = useState("")
  const [password, setPassword] =  useState("")

  const { signIn } = useContext(AuthContext)


  async function handleSubmit(event: FormEvent){
    event.preventDefault()
    const data = {
      email,
      password
    }

   await signIn(data)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Learning JWT</title>
        <meta name="description" content="Generated by create next app"   />
        <link rel="icon" href="/favicon.ico"  />
      </Head>

      

      <form className={styles.form} onSubmit={handleSubmit}>
        <h1>LOGIN</h1>
        <input type="text" value={email} placeholder='Email'onChange={(e)=>setEmail(e.target.value)}/>
        <input type="password" value={password} placeholder='Password'onChange={(e)=>setPassword(e.target.value)}/>
      
      
        <button type="submit" >Entrar</button>  
      </form>
      


    </div>
  )
}


