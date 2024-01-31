"use client"
import React, { useEffect, useState } from 'react'
import browser from 'browser-detect'
import { OtherProductSlider, SafariProductSlider } from './'

interface Props {
  images: { public_id: string, url: string }[]
}

export const ProductSlider: React.FC<Props> = ({ images }) => {

  const [browserName, setBrowserName] = useState('')

  useEffect(() => {
    setBrowserName(browser().name!)
  }, [])

  return (
    <div>
      {
        browserName === 'safari'
          ? <SafariProductSlider images={images} />
          : <OtherProductSlider images={images} />
      }
    </div>
  )
}