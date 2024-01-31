"use client"
import CartProvider from "@/context/cart/CartProvider"
import LogoProvider from "@/context/logo/LogoProvider"
import { SessionProvider } from "next-auth/react"
import React from "react"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LogoProvider>
        <CartProvider>
          { children }
        </CartProvider>
      </LogoProvider>
    </SessionProvider>
  )
}