import { IProduct } from "@/interfaces"
import ProductCard from "../products/ProductCard"

export default function Products({ products }: { products: IProduct[] }) {
  return (
    <div className="w-full flex px-4 mb-8">
      <div className="max-w-[1600px] w-full m-auto flex gap-4 justify-between flex-wrap">
        {
          products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))
        }
      </div>
    </div>
  )
}