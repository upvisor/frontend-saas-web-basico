"use client"
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { City, ISell, Region } from '../../interfaces'
import { Select } from '../ui'

interface Props {
  setShipping: any
  sell: ISell
  setSell: any
}

export const Shipping: React.FC<Props> = ({ setShipping, sell, setSell }) => {

  const [regions, setRegions] = useState<Region[]>()
  const [citys, setCitys] = useState<City[]>()

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
        setSell({ ...sell, region: e.target.value })
      }
    
      const cityChange = async (e: any) => {
        const city = citys?.find(city => city.countyName === e.target.value)
        console.log(city?.countyCode)
        const request = await axios.post('https://testservices.wschilexpress.com/rating/api/v1.0/rates/courier', {
          "originCountyCode": "QNOR",
          "destinationCountyCode": city?.countyCode,
          "package": {
              "weight": "5",
              "height": "30",
              "width": "30",
              "length": "30"
          },
          "productType": 3,
          "contentType": 1,
          "declaredWorth": "10000",
          "deliveryTime": 0
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Ocp-Apim-Subscription-Key': process.env.NEXT_PUBLIC_CHILEXPRESS_COTIZADOR
          }
        })
        setShipping(request.data.data.courierServiceOptions)
        setSell({ ...sell, city: e.target.value })
      }

  return (
    <div className='flex gap-2 w-full flex-col sm:flex-row'>
      <div className='flex flex-col gap-2 w-full sm:w-1/2'>
        <p className='text-sm'>Región</p>
        <Select selectChange={regionChange}>
          <option>Seleccionar Región</option>
          {
          regions !== undefined
            ? regions.map(region => <option key={region.regionId}>{region.regionName}</option>)
            : ''
          }
        </Select>
      </div>
      <div className='flex flex-col gap-2 w-full sm:w-1/2'>
        <p className='text-sm'>Ciudad</p>
        <Select selectChange={cityChange}>
          <option>Seleccionar Ciudad</option>
          {
            citys !== undefined
              ? citys.map(city => <option key={city.countyCode}>{city.countyName}</option>)
              : ''
          }
        </Select>
      </div>
    </div>
  )
}
