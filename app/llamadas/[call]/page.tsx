import { Call } from "@/components/design"
import { ICall, IPayment, IService, IStoreData } from "@/interfaces"

export const revalidate = 3600

async function fetchCall (call: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/call-name/${call}`)
  return res.json()
}

async function fetchCalls () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/calls`)
  return res.json()
}

async function fetchServices () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`)
  return res.json()
}

async function fetchPayment () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment`)
  return res.json()
}

async function fetchStoreData () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store-data`)
  return res.json()
}

export default async function Page({ params }: { params: { call: string } }) {

  const call: ICall = await fetchCall(params.call)

  const calls: ICall[] = await fetchCalls()

  const services: IService[] = await fetchServices()

  const payment: IPayment = await fetchPayment()

  const storeData: IStoreData = await fetchStoreData()

  return (
    <>
      <Call calls={calls} content={{ content: '', info: {}, meeting: call._id }} services={services} payment={payment} storeData={storeData} index={0} />
    </>
  )
}