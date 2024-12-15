import React from 'react'
import { Spinner2 } from '.'

interface Props {
    submitLoading: boolean
    textButton: string
    action: any
    config?: string
    style?: any
}

export const ButtonSubmit: React.FC<Props> = ({ submitLoading, textButton, action, config, style }) => {
  return (
    <button onClick={action} className={`${config} ${style?.design === 'Borde' ? 'border-b' : style?.design === 'Sombreado' ? 'border-b border-black/5' : ''} ${style?.form === 'Redondeadas' ? 'rounded-xl' : ''} ${submitLoading ? 'cursor-not-allowed' : ''} transition-colors duration-300 h-10`} style={{ backgroundColor: style?.primary, color: style?.button }}>{submitLoading ? <Spinner2 /> : textButton}</button>
  )
}
