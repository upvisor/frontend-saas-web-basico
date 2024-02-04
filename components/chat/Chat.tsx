"use client"
import React, { useState } from 'react'

export const Chat = () => {

  const [chat, setChat] = useState('-mb-[450px]')

  return (
    <>
      <div className={`${chat} transition-all duration-500 fixed flex flex-col justify-between overflow-hidden shadow-md z-50 bottom-0 right-0 mr-4 w-[350px] h-[450px] bg-white rounded-xl`}>
        <div className='w-full h-20 bg-main shadow-md flex p-4'>
          <p className='my-auto font-medium text-lg text-white'>Chat</p>
        </div>
        <div className='w-full flex flex-col gap-2 px-4 overflow-y-auto' style={{ height: 'calc(100% - 150px)' }}>
          <div className='bg-main text-white text-sm p-1.5 w-fit rounded-md mr-6'><p>hola que tal como estas el dia de hoy que esta muy lindo el dia</p></div>
          <div className=' w-fit ml-auto'><p className='ml-6 bg-[#f5f5f7] p-1.5 text-sm rounded-md'>Hola, sii esta hermoso la verdad me gusto mucho</p></div>
          <div className='bg-main text-white text-sm p-1.5 w-fit rounded-md mr-6'><p>hola que tal como estas el dia de hoy que esta muy lindo el dia</p></div>
          <div className=' w-fit ml-auto'><p className='ml-6 bg-[#f5f5f7] p-1.5 text-sm rounded-md'>Hola, sii esta hermoso la verdad me gusto mucho</p></div>
          <div className='bg-main text-white text-sm p-1.5 w-fit rounded-md mr-6'><p>hola que tal como estas el dia de hoy que esta muy lindo el dia</p></div>
          <div className=' w-fit ml-auto'><p className='ml-6 bg-[#f5f5f7] p-1.5 text-sm rounded-md'>Hola, sii esta hermoso la verdad me gusto mucho</p></div>
          <div className='bg-main text-white text-sm p-1.5 w-fit rounded-md mr-6'><p>hola que tal como estas el dia de hoy que esta muy lindo el dia</p></div>
          <div className=' w-fit ml-auto'><p className='ml-6 bg-[#f5f5f7] p-1.5 text-sm rounded-md'>Hola, sii esta hermoso la verdad me gusto mucho</p></div>
          <div className='bg-main text-white text-sm p-1.5 w-fit rounded-md mr-6'><p>hola que tal como estas el dia de hoy que esta muy lindo el dia</p></div>
          <div className=' w-fit ml-auto'><p className='ml-6 bg-[#f5f5f7] p-1.5 text-sm rounded-md'>Hola, sii esta hermoso la verdad me gusto mucho</p></div>
          <div className='bg-main text-white text-sm p-1.5 w-fit rounded-md mr-6'><p>hola que tal como estas el dia de hoy que esta muy lindo el dia</p></div>
          <div className=' w-fit ml-auto'><p className='ml-6 bg-[#f5f5f7] p-1.5 text-sm rounded-md'>Hola, sii esta hermoso la verdad me gusto mucho</p></div>
        </div>
        <div className='w-full pb-4 px-4 flex gap-2'>
          <input type='text' placeholder='Escribe tu mensaje' className='border p-1.5 text-sm rounded w-full' />
          <button className='bg-main text-white w-28 rounded-md text-sm border border-main transition-colors duration-200 hover:bg-transparent hover:text-main'>Enviar</button>
        </div>
      </div>
      <button onClick={() => chat === '-mb-[450px]' ? setChat('mb-[90px]') : setChat('-mb-[450px]')} className='fixed shadow-md z-50 bg-main flex bottom-0 right-0 mr-4 mb-4 w-14 h-14 rounded-full'>
        {
          chat === '-mb-[450px]'
            ? <svg className='m-auto' stroke="#ffffff" fill="#ffffff" stroke-width="0" viewBox="0 0 1024 1024" height="28px" width="28px" xmlns="http://www.w3.org/2000/svg"><path d="M464 512a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm200 0a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm-400 0a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm661.2-173.6c-22.6-53.7-55-101.9-96.3-143.3a444.35 444.35 0 0 0-143.3-96.3C630.6 75.7 572.2 64 512 64h-2c-60.6.3-119.3 12.3-174.5 35.9a445.35 445.35 0 0 0-142 96.5c-40.9 41.3-73 89.3-95.2 142.8-23 55.4-34.6 114.3-34.3 174.9A449.4 449.4 0 0 0 112 714v152a46 46 0 0 0 46 46h152.1A449.4 449.4 0 0 0 510 960h2.1c59.9 0 118-11.6 172.7-34.3a444.48 444.48 0 0 0 142.8-95.2c41.3-40.9 73.8-88.7 96.5-142 23.6-55.2 35.6-113.9 35.9-174.5.3-60.9-11.5-120-34.8-175.6zm-151.1 438C704 845.8 611 884 512 884h-1.7c-60.3-.3-120.2-15.3-173.1-43.5l-8.4-4.5H188V695.2l-4.5-8.4C155.3 633.9 140.3 574 140 513.7c-.4-99.7 37.7-193.3 107.6-263.8 69.8-70.5 163.1-109.5 262.8-109.9h1.7c50 0 98.5 9.7 144.2 28.9 44.6 18.7 84.6 45.6 119 80 34.3 34.3 61.3 74.4 80 119 19.4 46.2 29.1 95.2 28.9 145.8-.6 99.6-39.7 192.9-110.1 262.7z"></path></svg>
            : <svg className='m-auto' stroke="#ffffff" fill="#ffffff" stroke-width="0" viewBox="0 0 512 512" height="28px" width="28px" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M368 368 144 144m224 0L144 368"></path></svg>
        }
      </button>
    </>
  )
}
