export interface Region {
  regionId: string
  regionName: string,
  ineRegionCode: 2
}

export interface City {
  countyCode: string
  countyName: string
  regionCode: string
  ineContyCode: number
  queryMode: number
  coverageName: string
}

export interface IShipping {
  additionalServices: string[]
  conditions: string
  deliveryType: number
  didUseVolumetricWeight: boolean
  finalWeight: string
  serviceDescription: string
  serviceTypeCode: number
  serviceValue: string
}