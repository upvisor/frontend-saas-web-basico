"use client"
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { City, Region, IShipping } from '../../interfaces'
import { FreeShipping, NumberFormat } from '../../utils'

export const ShippingCost = () => {

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
    <div>
      <select className='text-sm text-main border p-1 rounded-md focus:outline-none focus:border-main focus:ring-1 focus:ring-main dark:border-neutral-600 dark:text-white' onChange={regionChange}>
        <option>Seleccionar Región</option>
        {
        regions !== undefined
          ? regions.map(region => <option key={region.regionId}>{region.regionName}</option>)
          : ''
        }
      </select>
      {
        citys !== undefined
        ? <select className='text-sm text-main block border p-1 rounded-md mt-2 focus:outline-none focus:border-main focus:ring-1 focus:ring-main dark:border-neutral-600 dark:text-white' onChange={cityChange}>
          <option>Seleccionar Ciudad</option>
          {citys.map(city => <option key={city.countyCode}>{city.countyName}</option>)}
        </select>
        : ''
      }
      {
        shipping !== undefined
        ? <div className='flex flex-col gap-1 mt-2 '>
          <span className='mt-1 text-main dark:text-white'>Envíos express:</span>
          {FreeShipping.map(cityFree => {
            if (cityFree === city) {
              return <div className='flex justify-between p-2 border rounded-md dark:border-neutral-600' key={cityFree}>
                <span className='text-sm text-[#444444] dark:text-neutral-400'>Envío gratis en 24 a 48 horas</span>
                <span className='text-sm'>$0</span>
              </div>
            }
            return null
          })}
          <span className='mt-1 text-main dark:text-white'>Chilexpress:</span>
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
  )
}
