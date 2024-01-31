import React from 'react'
import { ContactPage } from '@/components/contact'

export const revalidate = 3600

async function fetchDesign () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/design`)
  return res.json()
}

export default async function Page () {

  const design = await fetchDesign()

  return (
    <ContactPage design={design} />
  )
}