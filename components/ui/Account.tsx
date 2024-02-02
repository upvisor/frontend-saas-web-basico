"use client"
import axios from 'axios'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { ChangeEvent, useState } from 'react'
import { Spinner2 } from './Spinner2'
import Link from 'next/link'
import { H3 } from '.'

interface Props {
    account: any
    setAccount: any
    setAccountPc: any
    setAccountView: any
    setAccountPosition: any
}

export const AccountLogin: React.FC<Props> = ({ account, setAccount, setAccountPc, setAccountView, setAccountPosition }) => {

  const [login, setLogin] = useState({
    email: '',
    password: ''
  })
  const [register, setRegister] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassrword: '',
    marketing: false
  })
  const [error, setError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [registerLoading, setRegisterLoading] = useState(false)
  const [closeLoading, setCloseLoading] = useState(false)

  const { data: session, status } = useSession()
  const router = useRouter()

  const loginHandleSubmit = async (e: any) => {
    e.preventDefault()
    setLoginLoading(true)
    setError('')
    const res = await signIn('credentials', {
      email: login.email,
      password: login.password,
      redirect: false
    })
    setLoginLoading(false)
    if (res?.error) return setError(res.error)
    if (res?.ok) {
      setLogin({ email: '', password: '' })
      setAccountPosition('-mt-[400px]')
      setTimeout(() => {
        setAccountView('hidden')
      }, 500)
      return router.push('/cuenta')
    }
  }

  const registerHandleSubmit = async (e: any) => {
    e.preventDefault()
    setRegisterLoading(true)
    setError('')
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/register`, register)
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/clients`, { email: register.email, firstName: register.firstName, lastName: register.lastName, tags: register.marketing ? ['Suscriptores'] : undefined })
    if (response.data.message) setError(response.data.message)
    const res = await signIn('credentials', {
      email: response.data.email,
      password: register.password,
      redirect: false
    })
    setRegisterLoading(false)
    if (res?.error) return setError(res.error)
    if (res?.ok) {
      setRegister({ firstName: '', lastName: '', email: '', password: '', confirmPassrword: '', marketing: false })
      setAccountPosition('-mt-[400px]')
      setTimeout(() => {
        setAccountView('hidden')
      }, 500)
      return router.push('/cuenta')
    } 
  }

  const handleLogout = async () => {
    setCloseLoading(true)
    await signOut({ callbackUrl: '/' })
    setCloseLoading(false)
  }

  return (
    <div onMouseEnter={() => setAccountPc(false)} onMouseLeave={() => setAccountPc(true)} className={`ml-auto flex flex-col gap-3 p-4 rounded-md shadow-md bg-white z-40 w-full dark:bg-neutral-900 dark:border dark:border-neutral-800 sm:w-96`}>
      {
        error !== ''
          ? (
            <div className='bg-red-600 w-full py-2 flex text-white'>
              <p className='m-auto'>{error}</p>
            </div>
          )
          : ''
      }
      <H3 config='text-center border-b pb-2'>Cuenta</H3>
      {
        status === 'authenticated'
          ? (
            <>
              <Link href='/cuenta' onClick={(e: any) => {
                setAccountPosition('-mt-[400px]')
                setTimeout(() => {
                  setAccountView('hidden')
                }, 500)
              }} className='p-1.5 hover:bg-neutral-100 rounded-md transition-colors duration-100 dark:hover:bg-neutral-800'>Ver mi cuenta</Link>
              <button onClick={handleLogout} className='bg-main font-medium border border-main tracking-wide transition-all duration-200 text-sm text-white h-10 dark:bg-neutral-800 hover:bg-white hover:text-main'>{closeLoading ? <Spinner2/> : 'CERRAR SESIÓN'}</button>
            </>
          )
          : (
            <>
              <div className='flex gap-2'>
                <button onClick={(e: any) => {
                  e.preventDefault()
                  setAccount('Ingresar')
                }} className={`${account === 'Ingresar' ? 'border-neutral-700' : 'border-white dark:border-neutral-900'} border-b-2 w-1/2 h-10 text-sm lg:text-[16px]`}>Ingresar</button>
                <button onClick={(e: any) => {
                  e.preventDefault()
                  setAccount('Registrarse')
                }} className={`${account === 'Registrarse' ? 'border-neutral-700' : 'border-white dark:border-neutral-900'} border-b-2 w-1/2 h-10 text-sm lg:text-[16px]`}>Registrarse</button>
              </div>
              {
                account === 'Ingresar'
                  ? (
                    <form onSubmit={loginHandleSubmit} className='flex flex-col gap-3'>
                      <div className='flex flex-col gap-2'>
                        <p className='text-sm'>Email</p>
                        <input type='text' placeholder='Email' onChange={(e: ChangeEvent<HTMLInputElement>) => setLogin({...login, email: e.target.value})} className='p-1.5 rounded border text-sm w-full focus:outline-none focus:border-main focus:ring-1 focus:ring-main dark:border-neutral-600' />
                      </div>
                      <div className='flex flex-col gap-2'>
                        <p className='text-sm'>Contraseña</p>
                        <input type='password' placeholder='*******' onChange={(e: ChangeEvent<HTMLInputElement>) => setLogin({...login, password: e.target.value})} className='p-1.5 rounded border text-sm w-full focus:outline-none focus:border-main focus:ring-1 focus:ring-main dark:border-neutral-600' />
                      </div>
                      <button type='submit' className='bg-main border rounded-md border-main transition-all duration-200 text-white h-10 hover:bg-white hover:text-main dark:bg-neutral-700 dark:border-neutral-700 hover:dark:bg-transparent hover:dark:text-neutral-500'>{loginLoading ? <Spinner2 /> : 'Ingresar'}</button>
                      <Link href='/' className='text-sm'>Olvide mi contraseña</Link>
                    </form>
                  )
                  : (
                    <form onSubmit={registerHandleSubmit} className='flex flex-col gap-3'>
                      <div className='flex flex-col gap-3 overflow-y-auto max-h-52'>
                        <div className='flex flex-col gap-2'>
                          <p className='text-sm'>Nombre</p>
                          <input type='text' placeholder='Nombre' onChange={(e: ChangeEvent<HTMLInputElement>) => setRegister({...register, firstName: e.target.value})} className='p-1.5 rounded border text-sm w-full focus:outline-none focus:border-main focus:ring-1 focus:ring-main dark:border-neutral-600' />
                        </div>
                        <div className='flex flex-col gap-2'>
                          <p className='text-sm'>Apellido</p>
                          <input type='text' placeholder='Apellido' onChange={(e: ChangeEvent<HTMLInputElement>) => setRegister({...register, lastName: e.target.value})} className='p-1.5 rounded border text-sm w-full focus:outline-none focus:border-main focus:ring-1 focus:ring-main dark:border-neutral-600' />
                        </div>
                        <div className='flex flex-col gap-2'>
                          <p className='text-sm'>Email</p>
                          <input type='text' placeholder='Email' onChange={(e: ChangeEvent<HTMLInputElement>) => setRegister({...register, email: e.target.value})} className='p-1.5 rounded border text-sm w-full focus:outline-none focus:border-main focus:ring-1 focus:ring-main dark:border-neutral-600' />
                        </div>
                        <div className='flex flex-col gap-2'>
                          <p className='text-sm'>Contraseña</p>
                          <input type='password' placeholder='*******' onChange={(e: ChangeEvent<HTMLInputElement>) => setRegister({...register, password: e.target.value})} className='p-1.5 rounded border text-sm w-full focus:outline-none focus:border-main focus:ring-1 focus:ring-main dark:border-neutral-600' />
                        </div>
                        <div className='flex flex-col gap-2'>
                          <p className='text-sm'>Confirmar contraseña</p>
                          <input type='password' placeholder='*******' onChange={(e: ChangeEvent<HTMLInputElement>) => setRegister({...register, confirmPassrword: e.target.value})} className='p-1.5 rounded border text-sm w-full focus:outline-none focus:border-main focus:ring-1 focus:ring-main dark:border-neutral-600' />
                        </div>
                        <div className='flex gap-2'>
                          <input type='checkbox' checked={register.marketing} onChange={(e: ChangeEvent<HTMLInputElement>) => setRegister({ ...register, marketing: e.target.checked ? true : false })} />
                          <p className='text-sm'>Suscribirse a nuestra lista</p>
                        </div>
                      </div>
                      <button type='submit' className='bg-main rounded-md transition-all duration-200 border border-main text-white h-10 dark:bg-neutral-700 hover:bg-white hover:text-main dark:hover:bg-transparent dark:hover:border-neutral-700 dark:hover:text-neutral-500'>{registerLoading ? <Spinner2 /> : 'Registrarse'}</button>
                    </form>
                  )
              }
            </>
          )
      }
    </div>
  )
}