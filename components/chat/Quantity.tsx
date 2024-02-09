import React from 'react'

interface Props {
  currentValue: number
  maxValue: number
  updatedQuantity: (maxValue: number) => void
}

export const Quantity: React.FC<Props> = ({ currentValue, updatedQuantity, maxValue }) => {
  
  const addOrRemove = ( value: number ) => {
    if ( value === -1 ) {
      if ( currentValue === 1 ) return

      return updatedQuantity( currentValue - 1 )
    }

    if ( currentValue >= maxValue ) return

    updatedQuantity( currentValue + 1 )
  }
  
  return (
    <div className='border rounded-md mb-1 w-full justify-between h-8 border-button flex bg-white dark:bg-transparent'>
      <button className='pl-3 pr-3 text-button text-sm' onClick={ () => addOrRemove(-1) }>-</button>
      <span className='mt-auto mb-auto text-button w-4 text-center text-sm'>{ currentValue }</span>
      <button className='pl-3 pr-3 text-button text-sm' onClick={ () => addOrRemove(+1) }>+</button>
    </div>
  )
}