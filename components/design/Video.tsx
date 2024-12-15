"use client"
import React, { useState } from 'react'
import { H1, H2 } from '../ui'

export const Video = ({ content, index, style }: { content: any, index: any, style?: any }) => {

  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className='w-full p-4 flex py-8 md:py-12' style={{ background: `${content.info.typeBackground === 'Degradado' ? content.info.background : content.info.typeBackground === 'Color' ? content.info.background : ''}` }}>
      <div className='w-full max-w-[1280px] m-auto flex flex-col gap-4'>
        {
          content.info.description && content.info.description !== ''
            ? <p className='px-4 py-2 w-fit text-base lg:text-lg' style={{ backgroundColor: style.primary, color: style.button }}>{content.info.description}</p>
            : ''
        }
        {
          index === 0
            ? <H1 text={content.info.title} config='text-center font-semibold' color={content.info.textColor} />
            : <H2 text={content.info.title} config='text-center font-semibold' color={content.info.textColor} />
        }
        <div style={{ position: 'relative', paddingTop: '56.25%', backgroundColor: '#000' }}><iframe src={content.info.video} loading="lazy" onLoad={() => setIsLoaded(true)} style={{ border: 0, position: 'absolute', top: 0, height: '100%', width: '100%' }} allow="accelerometer;gyroscope;encrypted-media;picture-in-picture;" allowFullScreen={true}></iframe></div>
      </div>
    </div>
  )
}
