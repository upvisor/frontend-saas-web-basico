import { ContactPage } from "@/components/contact"
import { Block1, Block2, Block3, Block4, Block5, Block7, Blocks, Faq, Form, Lead1, Lead2, Reviews, Video } from "@/components/design"
import { Slider } from "@/components/home"
import { Subscribe } from "@/components/ui"
import { Design, ICall, IForm, IPayment, IService, IStoreData } from "@/interfaces"

export const revalidate = 3600

export const dynamicParams = true

async function fetchDesign (page: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page-funnel/${page}`, { next: { revalidate: 3600 } })
  return res.json()
}

async function fetchCalls () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/calls`, { next: { revalidate: 3600 } })
  return res.json()
}

async function fetchForms () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forms`, { next: { revalidate: 3600 } })
  return res.json()
}

async function fetchDesign1 () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/design`, { next: { revalidate: 3600 } })
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

export async function generateMetadata({
  params
}: {
  params: { page: string }
}) {
  const page: any = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page-funnel/${params.page}`, { next: { revalidate: 3600 } }).then((res) => res.json())
  return {
    title: page?.metaTitle && page?.metaTitle !== '' ? page?.metaTitle : '',
    description: page?.metaDescription && page?.metaDescription !== '' ? page?.metaDescription : '',
    openGraph: {
      title: page?.metaTitle && page?.metaTitle !== '' ? page?.metaTitle : '',
      description: page?.metaDescription && page?.metaDescription !== '' ? page?.metaDescription : '',
      url: `${process.env.NEXT_PUBLIC_WEB_URL}/${page.slug}`,
      images: [page?.image && page.image !== '' ? page.image : '']
    }
  }
}

export default async function Page({ params }: { params: { page: string } }) {
    
  const pageData: any = await fetchDesign(params.page)

  const formsData: IForm[] = await fetchForms()

  const designData: Design = await fetchDesign1()

  const storeDataData: IStoreData = await fetchStoreData()

  const styleData = fetchStyle()

  const [page, design, forms, storeData, style] = await Promise.all([pageData, designData, formsData, storeDataData, styleData])

  return (
    <div className="flex flex-col">
      {
        page?.design.map((content: any, index: any) => {
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
            return <Block5 key={content.content} content={content} index={index} forms={forms} design={design} style={style}/>
          } else if (content.content === 'Contacto') {
            return <ContactPage key={content.content} info={ content.info } index={index} style={style} />
          } else if (content.content === 'Suscripción') {
            return <Subscribe key={content.content} info={ content.info } style={style} />
          } else if (content.content === 'Lead 1') {
            return <Lead1 key={content.content} content={content} forms={forms} index={index} style={style} />
          } else if (content.content === 'Video') {
            return <Video key={content.content} content={content} index={index} />
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
          } else if (content.content === 'Formulario') {
            return <Form key={content.content} content={content} index={index} style={style} forms={forms} />
          }
        })
      }
    </div>
  )
}
