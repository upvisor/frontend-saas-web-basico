import { IInfo } from "@/interfaces"
import { H1 } from "../ui"

export default function Banner({ info }: { info: IInfo }) {
  return (
    <div className="w-full flex px-4">
      <div className="w-full max-w-[1600px] m-auto flex flex-col gap-2 pt-10 pb-2">
        <H1 config="text-center">{info.title}</H1>
        <p className="text-center">{info.description}</p>
      </div>
    </div>
  )
}