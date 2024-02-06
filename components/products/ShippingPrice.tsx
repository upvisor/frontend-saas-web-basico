"use client"
import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { City, IShipping, Region } from '@/interfaces'
import { FreeShipping, NumberFormat } from '@/utils'
import { Select } from '../ui'

export const ShippingPrice = () => {

  const [shippingView, setShippingView] = useState(0)
  const [shippingRotate, setShippingRotate] = useState('rotate-90')
  const [regions, setRegions] = useState<Region[]>()
  const [citys, setCitys] = useState<City[]>()
  const [shipping, setShipping] = useState<IShipping[]>()
  const [city, setCity] = useState('')

    const shippingRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (shippingRef.current) {
          setShippingView(shippingRotate === '-rotate-90' ? shippingRef.current.scrollHeight : 0)
        }
      }, [shippingRotate, regions, citys, shipping, city])

      const requestRegions = async () => {
        const request = await axios.get('https://testservices.wschilexpress.com/georeference/api/v1.0/regions', {
          headers: {
            'Cache-Control': 'no-cache',
            'Ocp-Apim-Subscription-Key': process.env.NEXT_PUBLIC_CHILEXPRESS_COBERTURA
          }
        })
        setRegions(request.data.regions)
      }
    
      useEffect(() => {
        requestRegions()
      }, [])
    
      const regionChange = async (e: any) => {
        const region = regions?.find(region => region.regionName === e.target.value)
        const request = await axios.get(`https://testservices.wschilexpress.com/georeference/api/v1.0/coverage-areas?RegionCode=${region?.regionId}&type=0`, {
          headers: {
            'Cache-Control': 'no-cache',
            'Ocp-Apim-Subscription-Key': process.env.NEXT_PUBLIC_CHILEXPRESS_COBERTURA
          }
        })
        setCitys(request.data.coverageAreas)
      }
    
      const cityChange = async (e: any) => {
        const city = citys?.find(city => city.countyName === e.target.value)
        const request = await axios.post('https://testservices.wschilexpress.com/rating/api/v1.0/rates/courier', {
          "originCountyCode": "QNOR",
          "destinationCountyCode": city?.countyCode,
          "package": {
              "weight": "1",
              "height": "10",
              "width": "10",
              "length": "2"
          },
          "productType": 3,
          "contentType": 1,
          "declaredWorth": "2333",
          "deliveryTime": 0
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Ocp-Apim-Subscription-Key': process.env.NEXT_PUBLIC_CHILEXPRESS_COTIZADOR
          }
        })
        setShipping(request.data.data.courierServiceOptions)
        setCity(e.target.value)
      }

  return (
    <div className='border-b pb-4 mt-4 dark:border-neutral-800'>
      <button onClick={(e: any) => {
        e.preventDefault()
        if (shippingRotate === '-rotate-90') {
          setShippingRotate('rotate-90')
        } else {
          setShippingRotate('-rotate-90')
        }
      }} className='flex gap-2 justify-between w-full'>
        <h5 className='text-[16px] font-medium md:text-[18px] dark:text-white'>Calcula los costos de envío</h5>
        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" className={`${shippingRotate} transition-all duration-150 ml-auto text-lg w-4 text-neutral-500`} xmlns="http://www.w3.org/2000/svg"><path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 0 0 302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 0 0 0-50.4z"></path></svg>
      </button>
      <div ref={shippingRef} style={{ maxHeight: `${shippingView}px`, overflow: 'hidden', transition: 'max-height 0.3s' }} className='mt-2'>
      <div className='flex flex-col gap-2'>
        <Select selectChange={regionChange}>
          <option>Seleccionar Región</option>
          {
          regions !== undefined
            ? regions.map(region => <option key={region.regionId}>{region.regionName}</option>)
            : ''
          }
        </Select>
      {
        citys !== undefined
        ? <Select selectChange={cityChange}>
          <option>Seleccionar Ciudad</option>
          {citys.map(city => <option key={city.countyCode}>{city.countyName}</option>)}
        </Select>
        : ''
      }
      {
        shipping !== undefined
        ? <div className='flex flex-col gap-2'>
          <span className='dark:text-white'>Envíos express:</span>
          {FreeShipping.map(cityFree => {
            if (cityFree === city) {
              return <div className='flex justify-between p-2 border rounded-md dark:border-neutral-600' key={cityFree}>
                <span className='text-sm dark:text-neutral-400'>Envío gratis en 24 a 48 horas</span>
                <span className='text-sm'>$0</span>
              </div>
            }
            return null
          })}
          <span className='dark:text-white'>Chilexpress:</span>
          {shipping.map(service => (
            <div key={service.serviceDescription} className='flex justify-between p-2 border rounded-md dark:border-neutral-600'>
              <span className='text-sm text-[#444444] dark:text-neutral-400'>{service.serviceDescription}</span>
              <span className='text-sm'>${NumberFormat(Number(service.serviceValue))}</span>
            </div>
          ))}
        </div>
        : ''
      }
    </div>
              </div>
            </div>
    
  )
}
