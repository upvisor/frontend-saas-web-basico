import React from 'react'

interface Props {
  currentValue: number
  maxValue: number
  updatedQuantity: (maxValue: number) => void
}

export const ItemCounter: React.FC<Props> = ({ currentValue, updatedQuantity, maxValue }) => {
  
  const addOrRemove = ( value: number ) => {
    if ( value === -1 ) {
      if ( currentValue === 1 ) return

      return updatedQuantity( currentValue - 1 )
    }

    if ( currentValue >= maxValue ) return

    updatedQuantity( currentValue + 1 )
  }
  
  return (
    <div className='border rounded-md h-[45px] w-fit border-button flex justify-between bg-white dark:bg-transparent'>
      <button className='pl-4 pr-6 text-button text-sm' onClick={ () => addOrRemove(-1) }>-</button>
      <span className='mt-auto mb-auto text-button w-4 text-center text-sm'>{ currentValue }</span>
      <button className='pl-6 pr-4 text-button text-sm' onClick={ () => addOrRemove(+1) }>+</button>
    </div>
  )
}
