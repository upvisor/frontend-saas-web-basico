"use client"
import { IDesign, IPayment, IPlan, IService } from '@/interfaces'
import React, { useState } from 'react'
import { Button, H1, H2, P } from '../ui'
import { NumberFormat } from '@/utils'
import { PopupPlans } from './PopupPlans'

interface Props {
    content: IDesign
    services: IService[]
    index: number
    payment: IPayment
    step?: string
}

export const Plans: React.FC<Props> = ({ content, services, index, payment, step }) => {

    const [popup, setPopup] = useState({ view: 'hidden', opacity: 'opacity-0', mouse: false })
    const [plan, setPlan] = useState<IPlan>()

  return (
    <>
    <PopupPlans popup={popup} setPopup={setPopup} plan={plan} services={services} payment={payment} content={content} step={step} />
    <div className="flex flex-col gap-8 px-4 py-8 m-auto w-full max-w-[1280px]" style={{ background: `${content.info.typeBackground === 'Degradado' ? content.info.background : content.info.typeBackground === 'Color' ? content.info.background : ''}` }}>
      {
        content.info.title && content.info.title !== '' || content.info.description && content.info.description !== ''
          ? (
            <div className='flex flex-col gap-4'>
              {
                content.info.title && content.info.title !== ''
                  ? index === 0
                    ? <H1 text={content.info.title} color={content.info.textColor} config='text-center font-semibold' />
                    : <H2 text={content.info.title} color={content.info.textColor} config='text-center font-semibold' />
                  : ''
              }
              {
                content.info.description && content.info.description !== ''
                  ? <P config='text-center' text={content.info.description} />
                  : ''
              }
            </div>
          )
          : ''
      }
      {
                  services?.find(service => service._id === content.service?.service)?.plans?.plans.length
                    ? (
                      <div className='flex gap-6 justify-around flex-wrap'>
                        {
                          services?.find(service => service._id === content.service?.service)?.plans?.plans.map(plan => (
                            <div className='p-6 rounded-xl border border-black/5 flex flex-col gap-4' key={plan._id} style={{ boxShadow: '0px 3px 20px 3px #11111110' }}>
                              <div className='flex flex-col gap-4'>
                                <p className='text-center font-medium text-xl'>{plan.name}</p>
                                <div className='flex gap-2 w-fit m-auto'>
                                  <p className='text-center font-bold text-3xl'>${NumberFormat(Number(plan.price))}</p>
                                  <p className='my-auto'>/ mes</p>
                                </div>
                                {
                                  plan.functionalities?.length
                                    ? (
                                      <>
                                        <p className='font-medium text-lg'>Funcionalidades:</p>
                                        <div className='flex flex-col gap-2'>
                                          {
                                            plan.functionalities?.map(functionality => functionality.value ? <p key={functionality.value}>{functionality.name}{functionality.value.toLocaleLowerCase() === 'si' ? '' : `: ${functionality.value}`}</p> : '')
                                          }
                                        </div>
                                      </>
                                    )
                                    : ''
                                }
                                <Button config='w-full' action={(e: any) => {
                                  e.preventDefault()
                                  setPlan(plan)
                                  setPopup({ ...popup, view: 'flex', opacity: 'opacity-0' })
                                  setTimeout(() => {
                                      setPopup({ ...popup, view: 'flex', opacity: 'opacity-1' })
                                  }, 10)
                                }}>Me interesa este plan</Button>
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    )
                    : ''
                }
    </div>
    </>
  )
}
