import { Design, IPolitics, IStoreData } from "@/interfaces"
import { FooterPage } from "./FooterPage"

export default function Footer({ storeData, politics, design }: { storeData: IStoreData, politics?: IPolitics, design: Design }) {
  return (
    <FooterPage storeData={storeData} politics={politics} design={design} />
  )
}