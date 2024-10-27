import { IDesign } from '@/interfaces'
import React from 'react'
import { P } from '../ui'

export const Block7 = ({ content }: { content: IDesign }) => {
  return (
    <div className='w-full flex bg-main p-2' style={{ background: `${content.info.typeBackground === 'Degradado' ? content.info.background : content.info.typeBackground === 'Color' ? content.info.background : ''}` }}>
      <P text={content.info.description} config='text-center m-auto text-white font-medium' color={content.info.textColor} />
    </div>
  )
}
