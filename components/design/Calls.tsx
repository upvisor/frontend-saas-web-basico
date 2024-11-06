import React from 'react'
import { LinkButton } from '../ui'
import { ICall, IDesign } from '@/interfaces'
import { NumberFormat } from '@/utils'

interface Props {
    content: IDesign
    calls: ICall[]
}

export const Calls: React.FC<Props> = ({ content, calls }) => {
  return (
    <div className="flex flex-col gap-6 px-4 py-8 m-auto w-full max-w-[1280px]" style={{ background: `${content.info.typeBackground === 'Degradado' ? content.info.background : content.info.typeBackground === 'Color' ? content.info.background : ''}` }}>
      {
        content.meetings?.map(meeting => {
          const call = calls.find(call => call._id === meeting)
          if (call) {
            return (
              <div key={meeting} className='border border-black/5 p-6 rounded-2xl' style={{ boxShadow: '0px 3px 20px 3px #11111110' }}>
                <div className='flex gap-6 justify-between flex-col sm:flex-row'>
                  <div className='flex flex-col gap-4'>
                    <p className='text-lg font-medium'>{call.nameMeeting}</p>
                    {
                      call.price
                        ? <p className='font-medium text-xl'>${NumberFormat(Number(call.price))}</p>
                        : ''
                    }
                    <div className="flex gap-2">
                      <svg className="w-5 text-gray-500" data-id="details-item-icon" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg" role="img"><path d="M.5 5a4.5 4.5 0 1 0 9 0 4.5 4.5 0 1 0-9 0Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M5 3.269V5l1.759 2.052" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                      <p className="text-gray-500">{call.duration}</p>
                    </div>
                    <p>{call.description}</p>
                  </div>
                  <div className='my-auto min-w-[200px]'>
                    <LinkButton url={`/llamadas/${call.nameMeeting.replaceAll(' ', '-')}`} config='py-[9px]'>Agendar llamada</LinkButton>
                  </div>
                </div>
              </div>
            )
          }
        })
      }
    </div>
  )
}
