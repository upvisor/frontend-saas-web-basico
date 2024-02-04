import { ICartProduct } from "@/interfaces"
import axios from "axios"
import Cookies from 'js-cookie'

declare const fbq: Function

export const addToCart = async ({ setText, tempCartProduct, setCart, user }: { setText: any, tempCartProduct: ICartProduct, setCart: any, user: any }) => {
  setText('Producto añadido')
  if (localStorage.getItem('cart')) {
    const cart: ICartProduct[] = JSON.parse(localStorage.getItem('cart')!)
    if (cart.find((product: ICartProduct) => product.name === tempCartProduct.name)) {
      const productSelect = cart.find((product: ICartProduct) => product.name === tempCartProduct.name)
      if (productSelect?.variation?.variation === tempCartProduct.variation?.variation) {
        const productIndex = cart.findIndex((product: ICartProduct) => product.name === tempCartProduct.name)
        cart[productIndex].quantity = tempCartProduct.quantity + cart[productIndex].quantity
        localStorage.setItem('cart', JSON.stringify(cart))
        setCart(JSON.parse(localStorage.getItem('cart')!))
      } else {
        const cartFinal = cart.concat(tempCartProduct)
        localStorage.setItem('cart', JSON.stringify(cartFinal))
        setCart(JSON.parse(localStorage.getItem('cart')!))
      }
    } else {
      const cartFinal = cart.concat(tempCartProduct)
      localStorage.setItem('cart', JSON.stringify(cartFinal))
      setCart(JSON.parse(localStorage.getItem('cart')!))
    }
  } else {
    localStorage.setItem('cart', `[${JSON.stringify(tempCartProduct)}]`)
    setCart(JSON.parse(localStorage.getItem('cart')!))
  }
  let offerPrice
  if (tempCartProduct.quantityOffers && tempCartProduct.quantity > 1) {
    const filter = tempCartProduct.quantityOffers.filter(offer => offer.quantity <= tempCartProduct.quantity)
    if (filter.length > 1) {
      offerPrice = filter.reduce((prev, current) => (prev.quantity > current.quantity) ? prev : current)
    } else {
      offerPrice = filter[0]
    }
  }
  const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/add-cart`, { product: tempCartProduct, fbp: Cookies.get('_fbp'), fbc: Cookies.get('_fbc') })
  fbq('track', 'AddToCart', {content_name: tempCartProduct.name, content_type: tempCartProduct.category.category, currency: "clp", value: tempCartProduct.price * tempCartProduct.quantity, content_ids: `['${tempCartProduct._id}']`, contents: [{id: tempCartProduct._id, category: tempCartProduct.category.category, quantity: tempCartProduct.quantity, item_price: tempCartProduct.price, title: tempCartProduct.name}], event_id: res.data._id})
  if (status === 'authenticated') {
    const cartLocal = JSON.parse(localStorage.getItem('cart')!)
    await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/account/${user._id}`, { cart: cartLocal })
  }
  setTimeout(() => {
    setText('Añadir al carrito')
  }, 3000)
}