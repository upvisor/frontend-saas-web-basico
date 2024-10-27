"use client"
import LogoProvider from "@/context/logo/LogoProvider"
import React from "react"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LogoProvider>
      { children }
    </LogoProvider>
  )
}