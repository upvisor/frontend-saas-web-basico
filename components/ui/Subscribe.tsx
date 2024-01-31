import { IDesign } from "@/interfaces"
import { SubscribePage } from "."

async function fetchDesign () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/design`)
  return res.json()
}

export default async function Subscribe() {

  const design: IDesign = await fetchDesign()

  return (
    <SubscribePage design={design} />
  )
}