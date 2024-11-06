"use client"
import Link from 'next/link'
import React, { PropsWithChildren, useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Design, ICall, IClient, IForm, IPayment, IPolitics, IStoreData } from '@/interfaces'
import { Button, Calendar, Input, LinkButton } from '../ui'
import axios from 'axios'
import Footer from '../ui/Footer'

interface Props {
  design: Design
  storeData: IStoreData
  calls: ICall[]
  forms: IForm[]
  politics: IPolitics | undefined
  payment: IPayment
}

export const Navbar: React.FC<PropsWithChildren<Props>> = ({ children, design, storeData, calls, forms, politics, payment }) => {

  const [menu, setMenu] = useState('-ml-[350px]')
  const [index, setIndex] = useState('hidden')
  const [popup, setPopup] = useState({ view: 'hidden', opacity: 'opacity-0', mouse: false })
  const [clientData, setClientData] = useState<IClient>({ email: '' })
  const [loadingPopup, setLoadingPopup] = useState(false)
  const [message, setMessage] = useState('')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const popupRef = useRef<HTMLDivElement | null>(null);

  const pathname = usePathname()
  const router = useRouter()

  

  useEffect(() => {
    if (localStorage.getItem('popup') !== design.popup?.title) {
      setTimeout(() => {
        setPopup({ view: 'flex', opacity: 'opacity-0', mouse: false })
        setTimeout(() => {
          setPopup({ view: 'flex', opacity: 'opacity-1', mouse: false })
        }, 10)
      }, (design.popup?.wait ? design.popup?.wait * 1000 : 0));
    }
  }, [])

  const getClientData = async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client-data`)
    setData(res.data)
  }

  useEffect(() => {
    getClientData()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node) && popup.view === 'flex') {
        setPopup({ ...popup, view: 'flex', opacity: 'opacity-0' })
        setTimeout(() => {
          setPopup({ ...popup, view: 'hidden', opacity: 'opacity-0' })
        }, 200)
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [popup, setPopup]);

  return (
    <>
      {
        design.popup?.active
          ? (
            <div className={`${popup.view} ${popup.opacity} transition-opacity duration-200 w-full h-full fixed bg-black/30 flex z-50`}>
              <div ref={popupRef} onMouseEnter={() => setPopup({ ...popup, mouse: true })} onMouseLeave={() => setPopup({ ...popup, mouse: false })} className={`${calls.find(call => call._id === design.popup?.content) ? 'max-w-[800px]' : 'max-w-[600px]'} w-full p-6 rounded-lg max-h-[600px] overflow-y-auto bg-white m-auto flex flex-col gap-4`}>
                {
                  message !== ''
                    ? <p>{message}</p>
                    : (
                      <>
                        {
                          design.popup.title && design.popup.title !== ''
                            ? <h2 className='text-2xl font-medium'>{design.popup.title}</h2>
                            : ''
                        }
                        {
                          design.popup.description && design.popup.description !== ''
                            ? <p>{design.popup.description}</p>
                            : ''
                        }
                        {
                          design.popup.content && design.popup.content !== ''
                            ? calls.find(call => call._id === design.popup?.content)
                              ? (
                                <div className="border rounded-lg shadow-md m-auto w-full max-w-[1280px]">
                                  {
                                    calls.find(call => call._id === design.popup?.content)
                                      ? <h2 className="text-center text-3xl border-b p-6 text-main font-semibold">{calls.find(call => call._id === design.popup?.content)?.title}</h2>
                                      : ''
                                  }
                                  <div className="lg:flex">
                                    <div className="p-6 border-b lg:border-b-0 lg:border-r flex flex-col gap-8 w-full lg:w-5/12">
                                      <div className="flex flex-col gap-3">
                                        <p className="text-sm font-medium">CARMEN ORELLANA</p>
                                        {
                                          calls.find(call => call._id === design.popup?.content)
                                            ? (
                                              <>
                                                <p className="text-xl font-semibold">{calls.find(call => call._id === design.popup?.content)?.nameMeeting}</p>
                                                <div className="flex gap-2">
                                                  <svg className="w-5 text-gray-500" data-id="details-item-icon" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg" role="img"><path d="M.5 5a4.5 4.5 0 1 0 9 0 4.5 4.5 0 1 0-9 0Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M5 3.269V5l1.759 2.052" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                                                  <p className="text-gray-500">{calls.find(call => call._id === design.popup?.content)?.duration}</p>
                                                </div>
                                              </>
                                            )
                                            : <p>No has seleccionado una llamada</p>
                                        }
                                      </div>
                                      {
                                        calls.find(call => call._id === design.popup?.content)
                                          ? (
                                            <div className="flex flex-col gap-3">
                                              <p className="font-medium">Descripción:</p>
                                              <div onClick={() => console.log(calls.find(call => call._id === design.popup?.content)?.description)} className="flex flex-col gap-2">
                                                {
                                                  calls.find(call => call._id === design.popup?.content)?.description?.split('\n').map(text => <p key={text}>{text}</p>)
                                                }
                                              </div>
                                            </div>
                                          )
                                          : ''
                                      }
                                    </div>
                                    <div className="p-6 w-full lg:w-7/12">
                                      <Calendar newClient={clientData} setNewClient={setClientData} call={calls.find(call => call._id === design.popup?.content)!} tags={calls.find(call => call._id === design.popup?.content)?.tags!} meeting={calls.find(call => call._id === design.popup?.content)?.nameMeeting!} payment={payment} />
                                    </div>
                                  </div>
                                </div>
                              )
                              : forms?.find(form => form._id === design.popup?.content)
                              ? (
                                <form className="flex w-full" onSubmit={async (e: any) => {
                                  e.preventDefault()
                                  if (!loading) {
                                    setLoading(true)
                                    setError('')
                                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                                    const form = forms.find(form => form._id === design.popup?.content)
                                    let valid = true
                                    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/clients`, clientData)
                                    if (form?.action === 'Ir a una pagina') {
                                      router.push(form.redirect!)
                                    } else if (form?.action === 'Mostrar mensaje') {
                                      setMessage(form.message!)
                                    }
                                    setLoading(false)
                                  }
                                }}>
                                  <div className="flex flex-col gap-4 border shadow-lg rounded-lg h-fit m-auto w-full p-6 max-w-[500px]">
                                    {
                                      message !== ''
                                        ? <p className='text-lg text-center font-medium'>{message}</p>
                                        : (
                                          <>
                                            {
                                              error !== ''
                                                ? <p className='px-2 py-1 bg-red-500 text-white w-fit'>{error}</p>
                                                : ''
                                            }
                                            <p className="text-main text-xl font-medium text-center">{forms?.find(form => form._id === design.popup?.content)?.title}</p>
                                            {
                                              forms?.find(form => form._id === design.popup?.content)?.informations.map(information => (
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
                                              forms?.find(form => form._id === design.popup?.content)?.labels.map(label => (
                                                <div key={label._id} className="flex flex-col gap-2">
                                                  <p>{label.text !== '' ? label.text : label.name}</p>
                                                  <Input
                                                    placeholder={label.name}
                                                    value={clientData.data?.find(dat => dat.name === label.name)?.value || clientData[label.data]}
                                                    inputChange={(e: any) => {
                                                      if (label.data === 'firstName' || label.data === 'lastName' || label.data === 'email' || label.data === 'phone') {
                                                        setClientData({ ...clientData, [label.data]: e.target.value })
                                                      } else if (Array.isArray(clientData.data)) {
                                                        const oldData = [...clientData.data];
                                                        const existingData = oldData.find(dat => dat.name === label.name);
                
                                                        if (existingData) {
                                                          existingData.value = e.target.value;
                                                        } else {
                                                          oldData.push({ name: label.data, value: e.target.value });
                                                        }
                
                                                        setClientData({ ...clientData, data: oldData });
                                                      } else {
                                                        setClientData({ ...clientData, data: [{ name: label.data, value: e.target.value }] });
                                                      }
                                                    }}
                                                  />
                                                </div>
                                              ))
                                            }
                                            <Button type='submit' config='w-full' loading={loading}>{forms?.find(form => form._id === design.popup?.content)?.button}</Button>
                                          </>
                                        )
                                    }
                                  </div>
                                </form>
                              )
                              : ''
                            : ''
                        }
                      </>
                    )
                }
              </div>
            </div>
          )
          : ''
      }
      <div className='w-full min-h-screen flex flex-col justify-between'>
      <div>
      {
        pathname !== '/finalizar-compra'
          ? design.header?.topStrip && design.header.topStrip !== ''
            ? (
              <div className='bg-[#22262c] text-white flex pl-2 pr-2 pt-1.5 pb-1.5 text-center sticky z-50'>
                <p className='m-auto font-medium text-[13px]'>{design.header.topStrip}</p>
              </div>
            )
            : ''
          : ''
      }
      <div style={{ top: '-0.5px' }} className='sticky flex w-full z-40'>
        <div className='m-auto w-full absolute bg-white border-b border-black/5 flex justify-between px-2 sm:py-0 dark:bg-neutral-900 dark:border-neutral-800' style={{ boxShadow: '0px 0px 10px 0px #11111115' }}>
          <div className='m-auto w-[1280px] flex justify-between py-1 sm:py-0'>
          <div className='hidden gap-2 sm:flex'>
            {
              storeData?.logo && storeData?.logo !== ''
                ? <Link href='/'><Image className='w-auto h-[52px] py-1' src={`${storeData.logo}`} alt='Logo' width={320} height={150} /></Link>
                : <Link href='/'><div className='h-[52px] flex'><p className='m-auto text-2xl font-medium'>SITIO WEB</p></div></Link>
            }
          </div>
          {
            pathname !== '/finalizar-compra'
              ? <>
                <div className='hidden gap-6 sm:flex'>
                  {
                    design.pages?.map(page => {
                      if (page.header) {
                        if (page.button) {
                          return (
                            <LinkButton key={page.slug} url={page.slug} config='py-[6px] my-auto'>{page.page}</LinkButton>
                          )
                        } else {
                          if (page.slug === '') {
                            return (
                              <Link key={page.slug} className='mt-auto flex h-full font-medium text-[#1c1b1b] mb-auto dark:text-white' href='/'>
                                <div className={`mt-auto ${pathname === '/' ? 'border-main dark:border-white' : 'border-white hover:border-main dark:border-neutral-900 dark:hover:border-white'} transition-colors duration-150 border-b-2 text-[#1c1b1b] mb-auto dark:text-white`}>{page.page}</div>
                              </Link>
                            )
                          } else {
                            return (
                              <Link key={page.slug} className='mt-auto flex h-full font-medium text-[#1c1b1b] mb-auto dark:text-white' href={`/${page.slug}`}>
                                <div className={`mt-auto ${pathname.includes(`/${page.slug}`) ? 'border-main dark:border-white' : 'border-white hover:border-main dark:border-neutral-900 dark:hover:border-white'} transition-colors duration-150 border-b-2 text-[#1c1b1b] mb-auto dark:text-white`}>{page.page}</div>
                              </Link>
                            )
                          }
                        }
                      }
                    })
                  }
                </div>
                <div className='flex px-2 w-full justify-between gap-4 sm:hidden'>
                  <div className='flex gap-4'>
                    {
                      menu === '-ml-[350px]'
                        ? <button onClick={() => {
                            setIndex('flex')
                            setTimeout(() => {
                              setMenu('')
                            }, 10)
                          }} aria-label='Boton para abrir el menu'>
                          <svg className="w-5" role="presentation" viewBox="0 0 20 14">
                            <path d="M0 14v-1h20v1H0zm0-7.5h20v1H0v-1zM0 0h20v1H0V0z" fill="currentColor"></path>
                          </svg>
                        </button>
                        : <button onClick={() => {
                            setMenu('-ml-[350px]')
                            setTimeout(() => {
                              setIndex('hidden')
                            }, 500)
                          }} className='flex w-5' aria-label='Boton para cerrar el menu'>
                          <svg className="m-auto w-[17px]" role="presentation" viewBox="0 0 16 14">
                            <path d="M15 0L1 14m14 0L1 0" stroke="currentColor" fill="none" fill-rule="evenodd"></path>
                          </svg>
                        </button>
                    }
                  </div>
                  <div className='flex gap-2 sm:hidden'>
                    {
                      storeData?.logo && storeData?.logo !== ''
                        ? <Link href='/'><Image className='max-w-[110px] min-w-[110px] py-0.5' src={`${storeData.logo}`} alt='Logo' width={155} height={53.72} /></Link>
                        : <Link href='/'><div className='h-[42px] flex'><p className='m-auto text-xl font-semibold'>SITIO WEB</p></div></Link>
                    }
                  </div>
                  <div />
                </div>
              </>
              : <div className='flex gap-4 justify-between'>
                <div className='gap-2 flex sm:hidden'>
                {
                  storeData?.logo && storeData?.logo !== ''
                    ? <Link href='/'><Image className='max-w-[110px] min-w-[110px] py-0.5' src={`${storeData.logo}`} alt='Logo' width={155} height={53.72} /></Link>
                    : <Link href='/'><div className='h-[42px] flex'><p className='m-auto text-xl font-semibold'>SITIO WEB</p></div></Link>
                }
                </div>
                <Link href='/tienda' className='mt-auto mb-auto text-sm text-neutral-500'>Continuar comprando</Link>
              </div>
          }
          </div>
        </div>
        <div className={`${index} w-full ${menu === '' ? 'bg-black/30' : ''} transition-colors duration-500 absolute z-30 justify-between 530:hidden`} style={{ top: '54px', height: 'calc(100vh - 49px)' }}>
          <div className={`${menu} flex flex-col p-4 shadow-md transition-all duration-500 bg-white overflow-hidden dark:bg-neutral-900`}>
            {
              design.pages?.map(page => {
                if (page.header) {
                  if (page.button) {
                    return (
                      <LinkButton key={page.slug} url={page.slug} config='py-[6px] mx-auto' click={() => {
                        setMenu('-ml-[350px]')
                        setTimeout(() => {
                          setIndex('hidden')
                        }, 500)
                      }}>{page.page}</LinkButton>
                    )
                  } else {
                    return (
                      <Link key={page.slug} className={`mb-4 font-medium text-[#1c1b1b] flex pb-2 min-w-[250px] border-b dark:border-neutral-600 dark:text-white`} onClick={() => {
                        setMenu('-ml-[350px]')
                        setTimeout(() => {
                          setIndex('hidden')
                        }, 500)
                      }} href={`/${page.slug}`}>{page.page}<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" className="ml-auto w-4 text-lg text-neutral-500" xmlns="http://www.w3.org/2000/svg"><path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 0 0 302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 0 0 0-50.4z"></path></svg></Link>
                    )
                  }
                
                }
              })
            }
          </div>
          <div className='h-full' style={{ width: 'calc(100% - 313px)' }} onClick={() => {
            setMenu('-ml-[350px]')
            setTimeout(() => {
              setIndex('hidden')
            }, 500)
          }} />
        </div>
      </div>
      { children }
      </div>
      <Footer storeData={storeData} politics={politics} design={design} />
    </div>
    </>
  )
}
