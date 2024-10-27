"use client"
import { IInfo } from "@/interfaces"
import { SubscribePage } from "."

export const Subscribe = ({ info }: { info: IInfo }) => {

  return (
    <SubscribePage info={info} />
  )
}