import React, { PropsWithChildren } from 'react'
import { Spinner2 } from './Spinner2'

interface Props {
    action?: any
    config?: string
    type?: any
    loading?: boolean
    style?: any
}

export const Button: React.FC<PropsWithChildren<Props>> = ({ children, action, config, type, loading, style }) => {
  return (
    <button type={type ? type : 'button'} onClick={action} className={`${config} ${style.design === 'Borde' ? '' : style.design === 'Sombreado' ? 'border-b border-black/5' : ''} ${style.form === 'Redondeadas' ? 'rounded-xl' : ''} ${loading !== undefined ? loading ? `cursor-not-allowed` : `` : ``} h-10 px-6 w-fit transition-colors duration-300`} style={{ backgroundColor: style.primary, color: style.button }}>{ loading !== undefined ? loading ? <Spinner2 /> : children : children }</button>
  )
}