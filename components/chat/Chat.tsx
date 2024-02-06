"use client"
import { IMessage } from '@/interfaces'
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import io from 'socket.io-client'

const socket = io(`${process.env.NEXT_PUBLIC_API_URL}/`)

export const Chat = () => {

  const [chatOpacity, setChatOpacity] = useState('-mb-[700px]')
  const [chat, setChat] = useState<IMessage[]>([{
    agent: false,
    response: '¡Hola! Mi nombre es Maaibot y soy un asistente virtual de la tienda Maaide, ¿En que te puedo ayudar?. Si en algun momento necesitas hablar con un agente escribe "agente" en el chat',
    adminView: false,
    userView: false
  }])
  const [newMessage, setNewMessage] = useState('')

  const chatRef = useRef(chat)
  const containerRef = useRef<HTMLDivElement>(null)
  const chatOpacityRef = useRef(chatOpacity)

  const getMessages = async () => {
    if (localStorage.getItem('chatId')) {
      const senderId = localStorage.getItem('chatId')
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chat/${senderId}`)
      setChat(response.data)
    }
  }

  useEffect(() => {
    getMessages()
  }, [])

  useEffect(() => {
    chatRef.current = chat
  }, [chat])

  useEffect(() => {
    chatOpacityRef.current = chatOpacity
  }, [chatOpacity])

  useEffect(() => {
    socket.on('messageAdmin', message => {
      if (localStorage.getItem('chatId') === message.senderId) {
        if (chatOpacityRef.current === 'opacity-1') {
          setChat(chatRef.current.concat([{ senderId: message.senderId, response: message.response, agent: true, adminView: true, userView: true }]))
        } else {
          setChat(chatRef.current.concat([{ senderId: message.senderId, response: message.response, agent: true, adminView: true, userView: false }]))
        }
      }
    })

    return () => {
      socket.off('messageAdmin', message => console.log(message))
    }
  }, [])

  const inputChange = (e: any) => {
    setNewMessage(e.target.value)
  }

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [chat])

  const submitMessage = async (e: any) => {
    e.preventDefault()
    let senderId
    let message = newMessage
    setNewMessage('')
    setChat(chat.concat({agent: false, message: message, userView: true}))
    if (localStorage.getItem('chatId')) {
      senderId = localStorage.getItem('chatId')
    } else {
      senderId = uuidv4()
      localStorage.setItem('chatId', senderId)
    }
    socket.emit('message', {message: message, senderId: senderId, createdAt: new Date()})
    if (chat.length === 1) {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chat/create`, { senderId: senderId, response: chat[0].response, agent: false, adminView: false, userView: true })
    }
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chat`, { senderId: senderId, message: newMessage, adminView: false, userView: true })
    if (response.data.response) {
      setChat(chat.filter(mes => mes.message === message))
    }
    setChat(chat.concat(response.data))
  }

  return (
    <>
        <div className={`${chatOpacity} fixed bottom-24 right-4 flex z-40 h-[480px] ml-3 justify-between flex-col gap-3 transition-all duration-500 bg-white shadow-md rounded-xl dark:bg-main sm:w-96 sm:h-[600px] sm:gap-4`}>
          <div className='h-28 w-full shadow-md bg-main rounded-t-xl flex p-4'>
            <span className='text-white mt-auto mb-auto text-xl'>Maaibot</span>
          </div>
          <div ref={containerRef} className='flex flex-col h-full gap-2 pl-3 sm:pl-4' style={{ overflow: 'overlay' }}>
            {
              chat?.length
                ? chat.map(info => (
                  <div key={info.response} className='flex flex-col gap-2 pr-3 sm:pr-4'>
                    {
                      info.message
                        ? (
                          <div className='flex flex-col gap-2 ml-6'>
                            <div className='bg-button text-white p-1.5 rounded-md w-fit ml-auto'><p>{info.message}</p></div>
                          </div>
                        )
                        : ''
                    }
                    {
                      info.response
                        ? (
                          <div className='flex flex-col gap-2 mr-6'>
                            <div className='bg-main text-white p-1.5 rounded-md w-fit'><p>{info.response}</p></div>
                          </div>
                        )
                        : ''
                    }
                  </div>
                ))
                : ''
            }
          </div>
          <form className='flex gap-2 pr-3 pl-3 pb-3 sm:pr-4 sm:pl-4 sm:pb-4'>
            <input onChange={inputChange} value={newMessage} type='text' placeholder='Mensaje' className='border w-full p-1.5 rounded-md dark:border-neutral-600' />
            <button type='submit' onClick={submitMessage} className='bg-main text-white w-24 rounded-md dark:bg-neutral-700 border border-main transition-colors duration-200 hover:bg-transparent hover:text-main'>Enviar</button>
          </form>
        </div>
        <button onClick={async (e: any) => {
          e.preventDefault()
          if (chatOpacity === '-mb-[700px]') {
            setTimeout(() => {
              setChatOpacity('')
            }, 50)
          } else {
            setChatOpacity('-mb-[700px]')
          }
          const senderId = localStorage.getItem('chatId')
          if (senderId) {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/chat-user/${senderId}`)
            getMessages()
          } else {
            chat[0].userView = true
            setChat(chat)
          }
        }} className='w-14 h-14 z-50 bg-main flex rounded-full fixed bottom-4 right-4 ml-auto shadow-md'>
          {
            chatOpacity === '-mb-[700px]'
              ? (
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" className="text-3xl text-white m-auto" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"></path><path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9.06 9.06 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.437 10.437 0 0 1-.524 2.318l-.003.011a10.722 10.722 0 0 1-.244.637c-.079.186.074.394.273.362a21.673 21.673 0 0 0 .693-.125zm.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6c0 3.193-3.004 6-7 6a8.06 8.06 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a10.97 10.97 0 0 0 .398-2z"></path>
                </svg>
              )
              : (
                <svg className="m-auto w-[19px] text-white" role="presentation" viewBox="0 0 16 14">
                  <path d="M15 0L1 14m14 0L1 0" stroke="currentColor" fill="none" fill-rule="evenodd"></path>
                </svg>
              )
          }
          {
            chat.map((message, index) => (
              <div key={index}>
                {
                  index === chat.length - 1
                    ? message.userView
                        ? ''
                        : <div className='h-3 w-3 rounded-full bg-button right-0 absolute' />
                    : ''
                  }
              </div>
            ))
          }
        </button>
    </>
  )
}
