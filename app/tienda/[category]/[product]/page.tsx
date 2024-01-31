import PageProduct from "@/components/products/PageProduct"
import { IProduct } from "@/interfaces"
import type { Metadata } from 'next'

export const revalidate = 60

async function fetchProduct (product: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${product}`)
  return res.json()
}

async function fetchDesign () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/design`)
  return res.json()
}

async function fetchProducts () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
  return res.json()
}
 
export async function generateMetadata({
  params
}: {
  params: { product: string }
}): Promise<Metadata> {

  const id = params.product
  const product: IProduct = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`).then((res) => res.json())
 
  return {
    title: product.titleSeo !== '' ? product.titleSeo : product.name,
    description: product.descriptionSeo !== '' ? product.descriptionSeo : `Esta es la pagina del producto ${product.name}`,
    openGraph: {
      title: product.titleSeo !== '' ? product.titleSeo : product.name,
      description: product.descriptionSeo !== '' ? product.descriptionSeo : `Esta es la pagina del producto ${product.name}`,
      images: [product.images[0].url],
      url: `${process.env.NEXT_PUBLIC_WEB_URL}/tienda/${product.category.slug}/${product.slug}`
    }
  }
}

export default async function ({ params }: { params: { product: string } }) {

  const product: IProduct = await fetchProduct(params.product)

  const design = await fetchDesign()

  const products = await fetchProducts()

  return (
    <>
      <head>
        <meta property="product:price:amount" content={product.price.toString()} />
        <meta property="product:price:currency" content="clp" />
        <meta property="product:availability" content={product.stock > 0 ? 'in stock' : 'Out of stock'} />
        <meta property="product:retailer_item_id" content={product._id} />
      </head>
      <PageProduct product={product} design={design} products={products} />
    </>
    
  )
}