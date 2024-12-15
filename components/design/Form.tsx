"use client"
import { IClient, IDesign, IForm } from '@/interfaces'
import React, { useRef, useState } from 'react'
import { Button, H1, H2, H3, Input, LinkButton, P, Select } from '../ui'
import axios from 'axios'
import Cookies from 'js-cookie'
import { usePathname, useRouter } from 'next/navigation'

interface Props {
    content: IDesign
    index: number
    style?: any,
    forms: IForm[]
}

declare const fbq: Function

export const Form: React.FC<Props> = ({ content, index, style, forms }) => {
  const [question, setQuestion] = useState(-1);
  const contentRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [client, setClient] = useState<IClient>({ email: '', tags: forms.find(form => form._id === content.form)?.tags, forms: [{ form: forms.find(form => form._id === content.form)?._id! }] })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState([])

  const router = useRouter()
  const pathname = usePathname()

  const toggleQuestion = (i: number) => {
    setQuestion(question === i ? -1 : i);
  };

  const getMaxHeight = (i: number): string => {
    if (contentRefs.current[i]) {
      return question === i ? `${contentRefs.current[i]?.scrollHeight}px` : "0px";
    }
    return "0px";
  };

  return (
    <div
      className="px-4 py-8 m-auto w-full flex md:py-12"
      style={{
        background: `${
          content.info.typeBackground === "Degradado"
            ? content.info.background
            : content.info.typeBackground === "Color"
            ? content.info.background
            : ""
        }`,
      }}
    >
      <div className='flex flex-col gap-8 w-full max-w-[1280px] m-auto'>
        {content.info.title && content.info.title !== "" || content.info.description && content.info.description !== "" ? (
          <div className="flex flex-col gap-4">
            {content.info.title && content.info.title !== "" ? (
              index === 0 ? (
                <H1 text={content.info.title} color={content.info.textColor} config="text-center font-semibold" />
              ) : (
                <H2 text={content.info.title} color={content.info.textColor} config="text-center font-semibold" />
              )
            ) : (
              ""
            )}
            {content.info.description && content.info.description !== "" ? (
              <P config="text-center" text={content.info.description} />
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
        <div className='w-full flex'>
          {
            content.form && content.form !== ''
              ? ''
              : (
                <div className='p-6 md:p-8 rounded-2xl border border-black/5 my-auto w-full max-w-[500px]' style={{ boxShadow: style.design === 'Sombreado' ? '0px 3px 20px 3px #11111110' : '' }}>
                  <p>Selecciona un formulario</p>
                </div>
              )
          }
          {
            content.form && content.form !== ''
              ? (
                <form className="flex w-full" onSubmit={async (e: any) => {
                  e.preventDefault()
                  if (!loading) {
                    setLoading(true)
                    setError('')
                    const form = forms.find(form => form._id === content.form)
                    let valid = true
                    let errorMessage = ''
                    form?.labels.forEach(label => {
                      if (label.data && (!client[label.data] || client[label.data].trim() === '')) {
                        valid = false
                        errorMessage = `Por favor, completa el campo ${label.text || label.name}.`
                      }
                    })
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                    if (client.email && !emailRegex.test(client.email)) {
                      valid = false
                      errorMessage = 'Por favor, ingresa un correo electrónico válido.'
                    }
                    if (!valid) {
                      setError(errorMessage)
                      setLoading(false)
                      return
                    }
                    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/clients`, client)
                    const newEventId = new Date().getTime().toString()
                    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/lead`, { firstName: client.firstName, lastName: client.lastName, email: client.email, phone: client.phone, fbc: Cookies.get('_fbc'), fbp: Cookies.get('_fbp'), service: client.services?.length && client.services[0].service !== '' ? client.services[0].service : undefined, funnel: client.funnel, step: client.funnel?.step, page: pathname, eventId: newEventId })
                    fbq('track', 'Lead', { first_name: client.firstName, last_name: client.lastName, email: client.email, phone: client.phone && client.phone !== '' ? `56${client.phone}` : undefined, fbp: Cookies.get('_fbp'), fbc: Cookies.get('_fbc'), content_name: client.services?.length && client.services[0].service !== '' ? client.services[0].service : undefined, contents: { id: client.services?.length && client.services[0].service !== '' ? client.services[0].service : undefined, quantity: 1 }, event_source_url: `${process.env.NEXT_PUBLIC_WEB_URL}${pathname}` }, { eventID: newEventId })
                    if (form?.action === 'Ir a una pagina') {
                      router.push(form.redirect!)
                    } else if (form?.action === 'Mostrar mensaje') {
                      setMessage(form.message!)
                    }
                  }
                }}>
                  <div className={`${style.design === 'Borde' ? 'border' : ''} ${style.form === 'Redondeadas' ? 'rounded-xl' : ''} flex flex-col gap-4 h-fit m-auto w-full p-6 max-w-[500px] bg-white`} style={{ boxShadow: style.design === 'Sombreado' ? '0px 3px 20px 3px #11111110' : '' }}>
                    {
                      message !== ''
                        ? <p className='text-lg text-center font-medium'>{message}</p>
                        : (
                          <>
                            {
                              error !== ''
                                ? <p className='px-2 py-1 bg-red-500 text-white w-fit m-auto'>{error}</p>
                                : ''
                            }
                            <p className="text-xl font-medium text-center" style={{ color: style.primary }}>{forms?.find(form => form._id === content.form)?.title}</p>
                            {
                              forms?.find(form => form._id === content.form)?.informations.map(information => (
                                <div key={information.text} className="flex gap-2">
                                  <div
                                    className="my-auto"
                                    dangerouslySetInnerHTML={{ __html: information.icon }}
                                  />
                                  <div className="flex flex-col my-auto">
                                    <p>{information.text}</p>
                                    {
                                      information.subText && information.subText !== ''
                                        ? <p className="text-gray-400">{information.subText}</p>
                                        : ''
                                    }
                                  </div>
                                </div>
                              ))
                            }
                            {
                              forms?.find(form => form._id === content.form)?.labels.map(label => (
                                <div key={label._id} className="flex flex-col gap-2">
                                  <p>{label.text !== '' ? label.text : label.name}</p>
                                  {
                                    label.type === 'Texto'
                                      ? (
                                        <Input
                                          style={style}
                                          placeholder={label.name}
                                          value={client.data?.find(dat => dat.name === label.name)?.value || client[label.data]}
                                          inputChange={(e: any) => {
                                            if (label.data === 'firstName' || label.data === 'lastName' || label.data === 'email' || label.data === 'phone') {
                                              setClient({ ...client, [label.data]: e.target.value })
                                            } else if (Array.isArray(client.data)) {
                                              const oldData = [...client.data];
                                              const existingData = oldData.find(dat => dat.name === label.name);
                                              if (existingData) {
                                                existingData.value = e.target.value;
                                              } else {
                                                oldData.push({ name: label.data, value: e.target.value });
                                              }
                                              setClient({ ...client, data: oldData });
                                            } else {
                                              setClient({ ...client, data: [{ name: label.data, value: e.target.value }] });
                                            }
                                          }}
                                        />
                                      )
                                      : ''
                                  }
                                  {
                                    label.type === 'Selector'
                                      ? (
                                        <Select selectChange={(e: any) => {
                                          if (label.data === 'firstName' || label.data === 'lastName' || label.data === 'email' || label.data === 'phone') {
                                            setClient({ ...client, [label.data]: e.target.value })
                                          } else if (Array.isArray(client.data)) {
                                            const oldData = [...client.data];
                                            const existingData = oldData.find(dat => dat.name === label.name);
                                            if (existingData) {
                                              existingData.value = e.target.value;
                                            } else {
                                              oldData.push({ name: label.data, value: e.target.value });
                                            }
                                            setClient({ ...client, data: oldData });
                                          } else {
                                            setClient({ ...client, data: [{ name: label.data, value: e.target.value }] });
                                          }
                                        }} value={client.data?.find(dat => dat.name === label.name)?.value || client[label.data]}>
                                          <option>Seleccionar opción</option>
                                          {
                                            label.datas?.map(data => <option key={data}>{data}</option>)
                                          }
                                        </Select>
                                      )
                                      : ''
                                  }
                                </div>
                              ))
                            }
                            <Button type='submit' config='w-full' loading={loading} style={style}>{forms?.find(form => form._id === content.form)?.button}</Button>
                          </>
                        )
                    }
                  </div>
                </form>
              )
              : ''
          }
        </div>
      </div>
    </div>
  );
};