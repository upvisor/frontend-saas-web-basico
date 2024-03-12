import { IInfo } from "@/interfaces"
import { SubscribePage } from "."

export default async function Subscribe({ info }: { info: IInfo }) {

  return (
    <SubscribePage info={info} />
  )
}