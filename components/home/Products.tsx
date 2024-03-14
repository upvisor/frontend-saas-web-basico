import { IDesign, IProduct } from "@/interfaces"
import SliderProducts from "./SliderProducts"
import { H2 } from "../ui"

export default function Products({ products }: { products: IProduct[] }) {
  return (
    <div className="w-full flex px-4 mb-8">
      <div className="w-full max-w-[1600px] m-auto flex flex-col gap-4">
        <H2>Productos recomendados</H2>
        <div>
          <SliderProducts products={products} />
        </div>
      </div>
    </div>
  )
}