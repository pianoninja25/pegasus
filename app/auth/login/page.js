
'use client'
import { signIn } from 'next-auth/react'
import { useRef } from 'react'

import './login.css'

const LoginPage = ({ error, callbackUrl }) => {
  
  const username = useRef()
  const password = useRef()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await signIn("credentials", {
      username: username.current,
      password: password.current, 
      redirect: true,
      callbackUrl: callbackUrl ?? '/'
    })
  }
  
  return (
    <div className='flex justify-center items-center w-full min-h-screen bg-gradient-to-br from-amtblue via-amtblue to-slate-900'>
      <div className='flex flex-col sm:flex-row justify-center items-center gap-[14vw] sm:gap-[8vw] h-full p-[10vw] sm:p-[8vw] m-[10vw] sm:m-[2vw] mb-[20vw] rounded-xl bg-black/10 neon-box'>
        <img src="/unifiber-text.svg" width={300} height={300} alt="unifiber" className='drop-shadow-lg sm:w-[22vw]' />  
        <form onSubmit={handleSubmit} className='relative pb-[6vw] sm:pb-[2vw] px-[4vw] sm:px-[3vw] rounded-lg shadow-lg bg-white/40 backdrop:blur-sm'>
          <h1 className='font-montserrat text-center text-[4vw] sm:text-[1.4vw] py-[6vw] sm:py-[2vw] text-slate-50'>PLEASE LOGIN</h1>
          {!!error && <p className='absolute w-full left-0 top-[4.4vw] text-center drop-shadow-md text-rose-400'>Authentication Failed!</p>}
          <div className='grid place-items-center gap-[4vw] sm:gap-[1.4vw] py-[1vw]'>
            <input 
              type='text'
              name='username' 
              placeholder='Username'
              onChange={(e) => username.current = e.target.value}
              className='w-5/6 sm:w-full h-[8vw] sm:h-[4vw] lg:h-[2.2vw] px-[4vw] sm:px-[1vw] font-montserrat text-xs rounded-lg shadow-sm bg-slate-200'
            />
            <input 
              type='password'
              name='password' 
              placeholder='Password'
              onChange={(e) => password.current = e.target.value}
              className='w-5/6 sm:w-full h-[8vw] sm:h-[4vw] lg:h-[2.2vw] px-[4vw] sm:px-[1vw] font-montserrat text-xs rounded-lg shadow-sm bg-slate-200'
            />
            <button onClick={handleSubmit} className='w-3/4 h-8 mt-4 font-montserrat text-white rounded-[4rem] text-sm shadow-sm bg-amtorange hover:brightness-105'>Sign In</button>
          </div>
        </form>
          
      </div>
    </div>
  )
}

export default LoginPage