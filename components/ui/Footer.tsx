import { ICategory, IStoreData } from "@/interfaces"
import { FooterPage } from "./FooterPage"

async function fetchStoreData () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store-data`)
  return res.json()
}

async function fetchCategories () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`)
  return res.json()
}

export default async function Footer() {

  const storeData: IStoreData = await fetchStoreData()

  const categories: ICategory[] = await fetchCategories()

  return (
    <FooterPage storeData={storeData} categories={categories} />
  )
}