"use client"
import React, { PropsWithChildren, useState, useEffect } from 'react'
import DesignContext from './DesignContext'
import axios from 'axios'

const DesignProvider: React.FC<PropsWithChildren> = ({ children }) => {
  
  const [design, setDesign] = useState({
    header: {
      topStrip: ''
    },
    home: {
      banner: [{
        image: { public_id: '', url: '' },
        title: '',
        text: '',
        textButton: '',
        linkButton: ''
      }],
      category: {
        titleCategory: true,
        title: '',
        descriptionCategory: true
      },
      products: {
        title: '',
        sectionProducts: 'Todos los productos'
      },
      seo: {
        metaTitle: '',
        metaDescription: ''
      }
    },
    product: {
      titleInfo: '',
      textInfo: '',
      title: '',
      sectionProducts: 'Todos los productos'
    },
    contact: {
      title: 'CONTACTO',
      text: 'Para cualquier pregunta o consulta que tengas, no dudes en ponerte en contacto con nosotros a traves del siguiente formulario, desde el chat del sitio web o desde nuestras redes sociales.',
      titleForm: 'LLENA EL SIGUIENTE FORMULARIO'
    },
    shop: {
      title: '',
      description: '',
      metaTitle: '',
      metaDescription: ''
    },
    subscription: {
      title: ''
    },
    cart: {
      title: '',
      sectionProducts: ''
    },
    blog: {
      metaTitle: '',
      metaDescription: ''
    },
    popup: {
      title: '',
      description: '',
      tag: ''
    }
  })
  const [load, setLoad] = useState(false)

  const getDesign = async () => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/design`)
    if (response.data) {
      setDesign(response.data)
      setLoad(true)
    }
  }

  useEffect(() => {
    getDesign()
  }, [])

  return (
    <DesignContext.Provider value={{
      design,
      setDesign,
      load
    }}>
      { children }
    </DesignContext.Provider>
  )
}

export default DesignProvider