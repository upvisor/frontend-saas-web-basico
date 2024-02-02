"use client"
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { City, Region, IShipping } from '../../interfaces'
import { FreeShipping, NumberFormat } from '../../utils'
import { H2 } from '../ui'

interface Props {
  setShippingCost: any
}

export const ShippingCart: React.FC<Props> = ({ setShippingCost }) => {

  const [regions, setRegions] = useState<Region[]>()
  const [citys, setCitys] = useState<City[]>()
  const [shipping, setShipping] = useState<IShipping[]>()
  const [city, setCity] = useState('')

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
    const region = regions?.find(region => region.regionName === e.target.value.toUpperCase())
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

  const inputChange = (e: any) => {
    setShippingCost(e.target.value)
  }

  return (
    <div className='flex flex-col gap-4'>
      <H2>Calcula los costos de envío</H2>
      <div className='flex flex-col gap-2'>
        <select className='text-sm border p-1 rounded focus:outline-none focus:border-main focus:ring-1 focus:ring-main dark:border-neutral-500 dark:text-white' onChange={regionChange}>
          <option>Seleccionar Región</option>
          {
          regions !== undefined
            ? regions.map(region => <option key={region.regionId}>{region.regionName.toLocaleLowerCase()}</option>)
            : ''
          }
        </select>
        {
          citys !== undefined
          ? <select className='text-sm block border p-1 rounded focus:outline-none focus:border-main focus:ring-1 focus:ring-main dark:border-neutral-500 dark:text-white' onChange={cityChange}>
            <option>Seleccionar Ciudad</option>
            {citys.map(city => <option key={city.countyCode}>{city.countyName}</option>)}
          </select>
          : ''
        }
      </div>
      {
        shipping !== undefined
        ? (
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-2'>
              <span className='dark:text-white'>Envíos express:</span>
              {FreeShipping.map(cityFree => {
                if (cityFree === city) {
                  return <div className='flex justify-between p-2 border rounded dark:border-neutral-500' key={cityFree}>
                    <div className='flex gap-2'>
                      <input type='radio' name='shipping' className='envio express' value={0} onChange={inputChange} />
                      <span className='text-sm text-[#444444] dark:text-neutral-400'>Envío gratis en 24 a 48 horas</span>
                    </div>
                    <span className='text-sm text-[#444444] dark:text-neutral-400'>$0</span>
                  </div>
                }
                return null
              })}
            </div>
            <div className='flex flex-col gap-2'>
              <span className='mt-1 dark:text-white'>Chilexpress:</span>
              {shipping.map(service => (
                <div key={service.serviceDescription} className='flex justify-between p-2 border rounded dark:border-neutral-500'>
                  <div className='flex gap-2'>
                    <input type='radio' name='shipping' className={service.serviceDescription} value={service.serviceValue} onChange={inputChange} />
                    <span className='text-sm text-[#444444] dark:text-neutral-400'>{service.serviceDescription}</span>
                  </div>
                  <span className='text-sm text-[#444444] dark:text-neutral-400'>${NumberFormat(Number(service.serviceValue))}</span>
                </div>
              ))}
            </div>
          </div>
        )
        : ''
      }
    </div>
  )
}
