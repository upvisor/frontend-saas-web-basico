import { IDesign, IService } from '@/interfaces'
import React from 'react'
import { Button, H1, H2, P } from '../ui'

interface Props {
    content: IDesign
    services: IService[]
    index: number
}

export const Services: React.FC<Props> = ({ content, services, index }) => {
  return (
    <div className="flex flex-col gap-8 px-4 py-12 m-auto w-full max-w-[1280px]" style={{ background: `${content.info.typeBackground === 'Degradado' ? content.info.background : content.info.typeBackground === 'Color' ? content.info.background : ''}` }}>
      <div className='flex flex-col gap-4'>
        {
          index === 0
            ? <H1 text={content.info.title} color={content.info.textColor} config='text-center font-semibold' />
            : <H2 text={content.info.title} color={content.info.textColor} config='text-center font-semibold' />
        }
        {
          content.info.description && content.info.description !== ''
            ? <P config='text-center' text={content.info.description} />
            : ''
        }
      </div>
      <div className='flex gap-8 flex-wrap justify-center'>
        {
          content.services?.length
            ? content.services.map(service => {
              const serviceFind = services?.find(servi => servi._id === service)
              if (serviceFind) {
                return (
                  <div key={service} className='flex flex-col gap-2 p-4 rounded-xl border border-main/5 w-[350px] h-60 justify-center' style={{ boxShadow: '0px 3px 10px 3px #c447ff15' }}>
                    <p className='font-medium text-2xl text-center text-main'>{serviceFind.name}</p>
                    <p className='text-center'>{serviceFind.description}</p>
                    <Button config='mx-auto'>Ver más información</Button>
                  </div>
                )
              }
            })
            : <p className='text-center m-auto'>No tienes servicios seleccionados</p>
        }
      </div>
    </div>
  )
}
