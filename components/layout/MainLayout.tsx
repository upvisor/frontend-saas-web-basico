import React from "react"
import { AllNavbar } from "."

async function fetchDesign () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/design`, { next: { revalidate: 3600 } })
  return res.json()
}

async function fetchStoreData () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store-data`, { next: { revalidate: 3600 } })
  return res.json()
}

async function fetchPolitics () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/politics`, { next: { revalidate: 3600 } })
  return res.json()
}

async function fetchForms () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forms`, { next: { revalidate: 3600 } })
  return res.json()
}

async function fetchStyle () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/style`, { next: { revalidate: 3600 } })
  return res.json()
}

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  
  const designData = fetchDesign()
  
  const storeDataData = fetchStoreData()

  const politicsData = fetchPolitics()

  const formsData = fetchForms()

  const styleData = fetchStyle()

  const [design, storeData, politics, forms, style] = await Promise.all([designData, storeDataData, politicsData, formsData, styleData])
  
  return (
    <AllNavbar design={design} storeData={storeData} politics={politics} forms={forms} style={style}>
      { children }
    </AllNavbar>
  )
}