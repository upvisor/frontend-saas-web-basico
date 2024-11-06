import React from "react"
import { Design, ICall, IForm, IFunnel, IPayment, IPolitics, IService, IStoreData } from "@/interfaces"
import { AllNavbar } from "."

async function fetchDesign () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/design`, { cache: 'no-store' })
  return res.json()
}

async function fetchStoreData () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store-data`, { cache: 'no-store' })
  return res.json()
}

async function fetchFunnels () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/funnels`, { cache: 'no-store' })
  return res.json()
}

async function fetchPolitics () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/politics`, { cache: 'no-store' })
  return res.json()
}

async function fetchCalls () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/calls`, { cache: 'no-store' })
  return res.json()
}

async function fetchForms () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forms`, { cache: 'no-store' })
  return res.json()
}

async function fetchPayment () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment`, { cache: 'no-store' })
  return res.json()
}

async function fetchServices () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`, { cache: 'no-store' })
  return res.json()
}

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  
  const design: Design = await fetchDesign()
  
  const storeData: IStoreData = await fetchStoreData()

  const funnels: IFunnel[] = await fetchFunnels()

  const politics: IPolitics | undefined = await fetchPolitics()

  const calls: ICall[] = await fetchCalls()

  const forms: IForm[] = await fetchForms()

  const payment: IPayment = await fetchPayment()

  const services: IService[] = await fetchServices()
  
  return (
    <AllNavbar design={design} storeData={storeData} funnels={funnels} politics={politics} calls={calls} forms={forms} payment={payment} services={services}>
      { children }
    </AllNavbar>
  )
}