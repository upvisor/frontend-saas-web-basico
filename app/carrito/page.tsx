import CartPage from "@/components/cart/CartPage"

export const revalidate = 60

async function fetchProducts () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
  return res.json()
}
  
async function fetchDesign () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/design`)
  return res.json()
}

export default async function Page () {

  const products = await fetchProducts()
  
  const design = await fetchDesign()

  return (
    <CartPage design={design} products={products} />
  )
}