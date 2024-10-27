import React from 'react'
import { Spinner2 } from '.'

interface Props {
    submitLoading: boolean
    textButton: string
    action: any
    config?: string
}

export const ButtonSubmit: React.FC<Props> = ({ submitLoading, textButton, action, config }) => {
  return (
    <button onClick={action} className={`${config} ${submitLoading ? 'cursor-not-allowed bg-main/80 hover:bg-main/80' : `hover:bg-main/80`} bg-main transition-colors duration-300 text-white rounded-xl h-10 shadow-md shadow-main/30`}>{submitLoading ? <Spinner2 /> : textButton}</button>
  )
}
