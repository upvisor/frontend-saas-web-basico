import React from 'react'
import { ContactPage } from '@/components/contact'
import { Design } from '@/interfaces'
import { Slider } from '@/components/home'
import { Subscribe } from '@/components/ui'
import { Block1, Block2, Block3, Block4, Block5, Block7, Blocks, Faq, Lead1, Lead2, Reviews, Video } from '@/components/design'

export const revalidate = 3600

async function fetchDesign () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/design`, { next: { revalidate: 3600 } })
  return res.json()
}

async function fetchForms () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forms`, { next: { revalidate: 3600 } })
  return res.json()
}

async function fetchStoreData () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store-data`, { next: { revalidate: 3600 } })
  return res.json()
}

async function fetchStyle () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/style`, { next: { revalidate: 3600 } })
  return res.json()
}

export async function generateMetadata() {
  const design: Design = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/design`, { next: { revalidate: 3600 } }).then((res) => res.json())
  const home = design.pages?.find(page => page.page === 'Contacto')
  return {
    title: home?.metaTitle && home?.metaTitle !== '' ? home?.metaTitle : '',
    description: home?.metaDescription && home?.metaDescription !== '' ? home?.metaDescription : '',
    openGraph: {
      title: home?.metaTitle && home?.metaTitle !== '' ? home?.metaTitle : '',
      description: home?.metaDescription && home?.metaDescription !== '' ? home?.metaDescription : '',
      url: `${process.env.NEXT_PUBLIC_WEB_URL}/contacto`,
      images: [home?.image && home.image !== '' ? home.image : '']
    }
  }
}

export default async function Page () {

  const designData = fetchDesign()

  const formsData = fetchForms()

  const storeDataData = fetchStoreData()

  const styleData = fetchStyle()

  const [design, forms, storeData, style] = await Promise.all([designData, formsData, storeDataData, styleData])

  return (
    <div className="flex flex-col">
      {
        design.pages.map((page: any) => {
          if (page.page === 'Contacto') {
            return (
              <>
                {
                  page.design.map((content: any, index: any) => {
                    if (content.content === 'Carrusel') {
                      return <Slider key={content.content} info={content.info} index={index} forms={forms} design={design} style={style} />
                    } else if (content.content === 'Bloque 1') {
                      return <Block1 key={content.content} content={content} index={index} forms={forms} design={design} style={style} />
                    } else if (content.content === 'Bloque 2') {
                      return <Block2 key={content.content} content={content} index={index} forms={forms} design={design} style={style} />
                    } else if (content.content === 'Bloque 3') {
                      return <Block3 key={content.content} content={content} index={index} forms={forms} design={design} style={style} />
                    } else if (content.content === 'Bloque 4') {
                      return <Block4 key={content.content} content={content} index={index} forms={forms} design={design} style={style} />
                    } else if (content.content === 'Bloque 5') {
                      return <Block5 key={content.content} content={content} index={index} forms={forms} design={design} style={style} />
                    } else if (content.content === 'Contacto') {
                      return <ContactPage key={content.content} info={ content.info } index={index} style={style} />
                    } else if (content.content === 'Suscripción') {
                      return <Subscribe key={content.content} info={ content.info } style={style} />
                    } else if (content.content === 'Lead 1') {
                      return <Lead1 key={content.content} content={content} forms={forms} index={index} style={style} />
                    } else if (content.content === 'Video') {
                      return <Video key={content.content} content={content} index={index} style={style} />
                    } else if (content.content === 'Bloque 7') {
                      return <Block7 key={content.content} content={content} style={style} />
                    } else if (content.content === 'Lead 2') {
                      return <Lead2 key={content.content} content={content} forms={forms} index={index} storeData={storeData} style={style} />
                    } else if (content.content === 'Preguntas frecuentes') {
                      return <Faq key={content.content} content={content} index={index} style={style} />
                    } else if (content.content === 'Bloques') {
                      return <Blocks key={content.content} content={content} index={index} style={style} />
                    } else if (content.content === 'Reseñas') {
                      return <Reviews key={content.content} content={content} index={index} style={style} />
                    }
                  })
                }
              </>
            )
          }
        })
      }
    </div>
  )
}