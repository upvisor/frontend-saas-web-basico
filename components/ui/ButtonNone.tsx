import React, { PropsWithChildren } from 'react'

export const ButtonNone: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <button className='py-3 w-full min-w-64 border rounded-md border-button/10 transition-all duration-200 h-fit bg-button/70 text-white cursor-not-allowed 450:w-56'>
      { children }
    </button>
  )
}
