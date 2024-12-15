"use client"
import Link from 'next/link'
import React, { PropsWithChildren, useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Design, ICall, IClient, IForm, IPayment, IPolitics, IStoreData } from '@/interfaces'
import { Button, Calendar, Input, LinkButton } from '../ui'
import axios from 'axios'
import Footer from '../ui/Footer'
import { SubPage } from './SubPage'

interface Props {
  design: Design
  storeData: IStoreData
  politics: IPolitics | undefined
  style?: any
}

export const Navbar: React.FC<PropsWithChildren<Props>> = ({ children, design, storeData, politics, style }) => {

  const [menu, setMenu] = useState('-ml-[350px]')
  const [index, setIndex] = useState('hidden')
  const [subPages, setSubPages] = useState(-1)

  const pathname = usePathname()

  return (
    <>
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
      <div style={{ top: '-0.5px' }} className='sticky flex w-full z-40 flex-col'>
        <div className={`${style.design === 'Borde' ? subPages !== -1 ? '' : 'border-b' : ''} z-40 m-auto w-full absolute bg-white flex justify-between px-2 sm:py-0 dark:bg-neutral-900 dark:border-neutral-800`} style={{ boxShadow: style.design === 'Sombreado' ? '0px 0px 10px 0px #11111115' : '' }}>
          <div className='m-auto w-[1280px] flex justify-between py-1 sm:py-0'>
          <div className='hidden gap-2 sm:flex'>
            {
              storeData?.logo && storeData?.logo !== ''
                ? <Link href='/'><Image className='w-auto h-[60px] py-1' src={`${storeData.logo}`} alt='Logo' width={320} height={150} /></Link>
                : <Link href='/'><div className='h-[60px] flex'><p className='m-auto text-2xl font-medium'>SITIO WEB</p></div></Link>
            }
          </div>
          {
            pathname !== '/finalizar-compra'
              ? <>
                <div className='hidden gap-6 sm:flex'>
                  {
                    design.pages?.map((page, index) => {
                      if (page.header) {
                        if (page.button) {
                          return (
                            <LinkButton key={page.slug} url={page.slug} config='py-[6px] my-auto'>{page.page}</LinkButton>
                          )
                        } else {
                          if (page.slug === '') {
                            return (
                              <Link key={page.slug} className='mt-auto flex h-full font-medium text-[#1c1b1b] mb-auto dark:text-white' href='/'>
                                <div className={`mt-auto ${pathname === '/' ? 'dark:border-white' : 'border-white dark:border-neutral-900 dark:hover:border-white'} transition-colors duration-150 text-[#1c1b1b] mb-auto dark:text-white`} style={{ borderBottom: pathname === '/' ? `2px solid ${style.primary}` : '2px solid transparent' }}>{page.page}</div>
                              </Link>
                            )
                          } else {
                            return (
                              <Link key={page.slug} className='mt-auto flex h-full font-medium text-[#1c1b1b] mb-auto dark:text-white' href={`/${page.slug}`} onMouseEnter={() => page.subPage?.length ? setSubPages(index) : console.log(page)} onMouseLeave={() => setSubPages(-1)}>
                                <div className={`mt-auto ${pathname.includes(`/${page.slug}`) ? 'dark:border-white' : 'border-white dark:border-neutral-900 dark:hover:border-white'} transition-colors duration-150 text-[#1c1b1b] mb-auto dark:text-white`} style={{ borderBottom: pathname.includes(`/${page.slug}`) ? `2px solid ${style.primary}` : '2px solid transparent' }}>{page.page}</div>
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
                        ? <Link href='/'><Image className='h-[52px] w-auto py-0.5' src={`${storeData.logo}`} alt='Logo' width={155} height={53.72} /></Link>
                        : <Link href='/'><div className='h-[52px] flex'><p className='m-auto text-xl font-semibold'>SITIO WEB</p></div></Link>
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
        <div className={`${index} w-full ${menu === '' ? 'bg-black/30' : ''} transition-colors duration-500 absolute z-30 justify-between 530:hidden`} style={{ top: '60px', height: 'calc(100vh - 49px)' }}>
          <div className={`${menu} flex flex-col p-4 shadow-md transition-all duration-500 bg-white overflow-hidden dark:bg-neutral-900`}>
            {
              design.pages?.map(page => {
                if (page.header) {
                  if (page.button) {
                    return (
                      <LinkButton key={page.slug} url={page.slug} config='py-[6px] mx-auto mb-4' click={() => {
                        setMenu('-ml-[350px]')
                        setTimeout(() => {
                          setIndex('hidden')
                        }, 500)
                      }}>{page.page}</LinkButton>
                    )
                  } else {
                    if (page.subPage?.length) {
                      <SubPage key={page.slug} page={page} setMenu={setMenu} setIndex={setIndex} />
                    } else {
                      return (
                        <Link key={page.slug} className={`font-medium mb-4 text-[#1c1b1b] flex pb-2 min-w-[250px] border-b dark:border-neutral-600 dark:text-white`} onClick={() => {
                          setMenu('-ml-[350px]')
                          setTimeout(() => {
                            setIndex('hidden')
                          }, 500)
                        }} href={`/${page.slug}`}>{page.page}<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" className="ml-auto w-4 text-lg text-neutral-500" xmlns="http://www.w3.org/2000/svg"><path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 0 0 302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 0 0 0-50.4z"></path></svg></Link>
                      )
                    }
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
        <div className={`${subPages !== -1 ? 'top-0' : '-mt-[130px]'} ${style.design === 'Borde' ? 'border-b' : ''} transition-all duration-500 z-30 w-full p-6 bg-white flex absolute h-32`} style={{ top: '52px', boxShadow: style.design === 'Sombreado' ? '0px 0px 10px 0px #11111115' : '' }} onMouseEnter={() => setSubPages(subPages)} onMouseLeave={() => setSubPages(-1)}>
          <div className='m-auto flex gap-6'>
            {
              subPages !== -1 ? design.pages[subPages].subPage?.map(subPage => <Link key={subPage.slug} href={subPage.slug!} className='text-lg' onClick={() => setSubPages(-1)}>{subPage.page}</Link>) : ''
            }
          </div>
        </div>
      </div>
      { children }
      </div>
      <Footer storeData={storeData} politics={politics} design={design} />
    </div>
    </>
  )
}
