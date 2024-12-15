import { IDesign } from '@/interfaces'
import React from 'react'
import { P } from '../ui'

export const Block7 = ({ content, style }: { content: IDesign, style?: any }) => {
  return (
    <div className='w-full flex p-2' style={{ background: `${content.info.typeBackground === 'Degradado' ? content.info.background : content.info.typeBackground === 'Color' ? content.info.background : style.primary}` }}>
      <P text={content.info.description} config='text-center m-auto text-white font-medium' color={content.info.textColor} />
    </div>
  )
}
