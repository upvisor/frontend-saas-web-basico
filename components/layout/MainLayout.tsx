import React from "react"
import { Design, ICall, IForm, IFunnel, IPayment, IPolitics, IService, IStoreData } from "@/interfaces"
import { AllNavbar } from "."

export const revalidate = 3600

async function fetchDesign () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/design`)
  return res.json()
}

async function fetchStoreData () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store-data`)
  return res.json()
}

async function fetchFunnels () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/funnels`)
  return res.json()
}

async function fetchPolitics () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/politics`)
  return res.json()
}

async function fetchCalls () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/calls`)
  return res.json()
}

async function fetchForms () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forms`)
  return res.json()
}

async function fetchPayment () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment`)
  return res.json()
}

async function fetchServices () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`)
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