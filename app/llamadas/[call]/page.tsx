import { Call } from "@/components/design"

async function fetchCall (call: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/call-name/${call}`, { next: { revalidate: 3600 } })
  return res.json()
}

async function fetchCalls () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/calls`, { next: { revalidate: 3600 } })
  return res.json()
}

async function fetchServices () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`, { next: { revalidate: 3600 } })
  return res.json()
}

async function fetchPayment () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment`, { next: { revalidate: 3600 } })
  return res.json()
}

async function fetchStoreData () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store-data`, { next: { revalidate: 3600 } })
  return res.json()
}

export default async function Page({ params }: { params: { call: string } }) {

  const callData = fetchCall(params.call)

  const callsData = fetchCalls()

  const servicesData = fetchServices()

  const paymentData = fetchPayment()

  const storeDataData = fetchStoreData()

  const [call, calls, services, payment, storeData] = await Promise.all([callData, callsData, servicesData, paymentData, storeDataData])

  return (
    <>
      <Call calls={calls} content={{ content: '', info: {}, meeting: call._id }} services={services} payment={payment} storeData={storeData} index={0} />
    </>
  )
}