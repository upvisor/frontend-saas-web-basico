"use client"
import React, { useState } from 'react'
import { Button, H1, H2, P } from '../ui'
import Link from 'next/link'
import Image from 'next/image'
import { Design, ICall, IDesign, IForm, IPayment } from '@/interfaces'
import { PopupPage } from './PopupPage'

export const Block3 = ({ content, index, forms, design, style }: { content: IDesign, index: any, forms: IForm[], design: Design, style?: any }) => {

  const [popup, setPopup] = useState({ view: 'hidden', opacity: 'opacity-0', mouse: false })
  const [cont, setCont] = useState('')

  return (
    <>
      <PopupPage popup={popup} setPopup={setPopup} content={cont} design={design} forms={forms} />
      <div key={content.content} className={`${index === 0 ? 'py-16 md:py-28' : 'py-8 md:py-12'} w-full flex px-4`} style={{ background: `${content.info.typeBackground === 'Degradado' ? content.info.background : content.info.typeBackground === 'Color' ? content.info.background : ''}` }}>
        <div className="text-center m-auto max-w-[1280px] w-full flex flex-col gap-8">
          <div className='flex gap-3 flex-col'>
            {
              index === 0
                ? <H1 text={content.info.title} color={content.info.textColor} />
                : <H2 text={content.info.title} color={content.info.textColor} />
            }
            <P text={content.info.description} color={content.info.textColor} />
            {
              content.info.buttonLink === 'Abrir popup' || forms.find(form => form._id === content.info.buttonLink)
                ? <Button action={(e: any) => {
                  e.preventDefault()
                  setCont(content.info.buttonLink!)
                  setPopup({ ...popup, view: 'flex', opacity: 'opacity-0' })
                  setTimeout(() => {
                    setPopup({ ...popup, view: 'flex', opacity: 'opacity-1' })
                  }, 10);
                }} style={style} config='mx-auto'>{content.info.button}</Button>
                : content.info.buttonLink === '' || content.info.button === ''
                  ? ''
                  : <Link href={`${content.info.buttonLink}`} className='mx-auto'><Button style={style}>{content.info.button}</Button></Link>
            }
          </div>
          {
            content.info?.image && content.info.image !== ''
              ? <Image className={`${style.form === 'Redondeadas' ? 'rounded-2xl' : ''} h-fit m-auto`} width={480} height={300} alt='Imagen slider prueba' src={content.info.image} />
              : ''
          }
        </div>
      </div>
    </>
  )
}
