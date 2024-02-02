"use client"
import Link from 'next/link'
import React, { PropsWithChildren, useEffect, useState, useContext, useRef } from 'react'
import { NavbarCart } from '../cart'
import { usePathname, useRouter } from 'next/navigation'
import CartContext from '../../context/cart/CartContext'
import Image from 'next/image'
import { ICategory, IDesign, IStoreData } from '@/interfaces'
import { AccountLogin } from '../ui'

interface Props {
  design: IDesign
  storeData: IStoreData
  categories: ICategory[]
}

export const Navbar: React.FC<PropsWithChildren<Props>> = ({ children, design, storeData, categories }) => {

  const [cartView, setCartView] = useState('hidden')
  const [cartPosition, setCartPosition] = useState('-mt-[180px]')
  const [cartPc, setCartPc] = useState(true)
  const [accountView, setAccountView] = useState('hidden')
  const [accountPosition, setAccountPosition] = useState('-mt-[360px]')
  const [accountPc, setAccountPc] = useState(true)
  const [account, setAccount] = useState('Ingresar')
  const [navCategories, setNavCategories] = useState('hidden')
  const [navCategoriesOpacity, setNavCategoriesOpacity] = useState('opacity-0 -mt-[30px]')
  const [categoriesPhone, setCategoriesPhone] = useState(0)
  const [menuButtons, setMenuButtons] = useState('opacity-0')
  const [rotate, setRotate] = useState('rotate-90')
  const [mouseEnter, setMouseEnter] = useState(true)
  const [menu, setMenu] = useState('w-0 pl-0 pr-0 pt-6 pb-6')
  const [index, setIndex] = useState('hidden')

  const pathname = usePathname()
  const router = useRouter()
  const {cart} = useContext(CartContext)

  const categoriesPhoneRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (index === 'flex') {
      setMenu('w-5/6 p-6')
    }
  }, [index])

  useEffect(() => {
    console.log(storeData)
  }, [])

  useEffect(() => {
    if (categoriesPhoneRef.current) {
      setCategoriesPhone(rotate === '-rotate-90' ? 120 * categories.length : 0)
    }
  }, [rotate])

  return (
    <>
      <div className='w-full'>
      {
        pathname !== '/finalizar-compra'
          ? design.header?.topStrip && design.header?.topStrip !== ''
            ? (
              <div className='bg-[#22262c] text-white flex pl-2 pr-2 pt-1.5 pb-1.5 text-center sticky z-50'>
                <p className='m-auto font-medium text-[13px]'>{design.header?.topStrip}</p>
              </div>
            )
            : ''
          : ''
      }
      <div style={{ top: '-0.5px' }} className='sticky flex w-full z-40'>
        <div className='m-auto w-full absolute bg-white border-b flex justify-between px-2 sm:py-0 dark:bg-neutral-900 dark:border-neutral-800'>
          <div className='m-auto w-[1600px] flex justify-between py-1 sm:py-0'>
          <div className='hidden gap-2 sm:flex'>
            {
              storeData?.logo && storeData?.logo.url !== ''
                ? <Link href='/'><Image className='w-auto h-[52px] py-1' src={`${storeData.logo.url}`} alt='Logo' width={155} height={53.72} /></Link>
                : <Link href='/'><div className='h-[52px] w-1 flex'><p className='m-auto text-2xl font-medium'>TIENDA</p></div></Link>
            }
          </div>
          {
            pathname !== '/finalizar-compra'
              ? <>
                <div className='hidden gap-6 sm:flex'>
                  <Link onMouseEnter={() => {
                    setTimeout(() => {
                      setNavCategories('hidden')
                    }, 200)
                  }} className='mt-auto flex h-full font-medium text-[#1c1b1b] mb-auto dark:text-white' href='/'>
                    <div className={`mt-auto ${pathname === '/' ? 'border-main dark:border-white' : 'border-white hover:border-main dark:border-neutral-900 dark:hover:border-white'} transition-colors duration-150 border-b-2 text-[#1c1b1b] mb-auto dark:text-white`}>Inicio</div>
                  </Link>
                  <Link className='flex h-full' href='/tienda' onMouseEnter={() => {
                    setNavCategories('flex')
                    setTimeout(() => {
                      setNavCategoriesOpacity('opacity-1 -mt-[1px]')
                    }, 50)
                  }} onMouseLeave={() => {
                    setNavCategoriesOpacity('opacity-0 -mt-[30px]')
                    setTimeout(() => {
                      if (!mouseEnter) {
                        setNavCategories('hidden')
                      }
                    }, 200)
                  }} onClick={() => {
                    setNavCategoriesOpacity('opacity-0 -mt-[30px]')
                    setTimeout(() => {
                      setNavCategories('hidden')
                    }, 200)
                  }}>
                    <div className={`mt-auto ${pathname.includes('/tienda') ? 'border-main dark:border-white' : 'border-white hover:border-main dark:border-neutral-900 dark:hover:border-white'} transition-colors duration-150 border-b-2 font-medium text-[#1c1b1b] mb-auto dark:text-white`}>Tienda</div>
                  </Link>
                  <Link onMouseEnter={() => {
                    setTimeout(() => {
                      setNavCategories('hidden')
                    }, 200)
                  }} className='mt-auto font-medium text-[#1c1b1b] mb-auto dark:text-white' href='/blog'>
                    <div className={`mt-auto ${pathname.includes('/blog') ? 'border-main dark:border-white' : 'border-white hover:border-main dark:border-neutral-900 dark:hover:border-white'} transition-colors duration-150 border-b-2 text-[#1c1b1b] mb-auto dark:text-white`}>Blog</div>
                  </Link>
                  <Link className='mt-auto font-medium text-[#1c1b1b] mb-auto dark:text-white' href='/contacto'>
                    <div className={`mt-auto ${pathname.includes('/contacto') ? 'border-main dark:border-white' : 'border-white hover:border-main dark:border-neutral-900 dark:hover:border-white'} transition-colors duration-150 border-b-2 text-[#1c1b1b] mb-auto dark:text-white`}>Contacto</div>
                  </Link>
                  {
                    accountView === 'hidden'
                      ? (
                        <button onClick={(e: any) => {
                          e.preventDefault()
                          setAccountView('flex')
                          setTimeout(() => {
                            setAccountPosition('')
                          }, 10)
                        }}>
                          <svg width="21" height="19" viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="10.9531" cy="6" r="5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></circle>
                            <path d="M20.4906 18C19.2164 13.9429 15.4261 11 10.9484 11C6.47081 11 2.68051 13.9429 1.40625 18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
                          </svg>
                        </button>
                      )
                      : (
                        <button onClick={(e: any) => {
                          e.preventDefault()
                          setAccountPosition('-mt-[360px]')
                          setTimeout(() => {
                            setAccountView('hidden')
                          }, 400)
                        }}>
                          <svg className="m-auto w-[21px] px-[2px]" role="presentation" viewBox="0 0 16 14">
                            <path d="M15 0L1 14m14 0L1 0" stroke="currentColor" fill="none" fill-rule="evenodd"></path>
                          </svg>
                        </button>
                      )
                  }
                  {
                    cartView === 'hidden'
                      ? (
                        <div>
                          <button onClick={() => {
                            setCartView('flex')
                            setTimeout(() => {
                              setCartPosition('')
                            }, 10)
                          }} className='flex h-full mr-2'>
                            <svg className='m-auto cursor-pointer w-[17px]' role="presentation" viewBox="0 0 17 20">
                              <path d="M0 20V4.995l1 .006v.015l4-.002V4c0-2.484 1.274-4 3.5-4C10.518 0 12 1.48 12 4v1.012l5-.003v.985H1V19h15V6.005h1V20H0zM11 4.49C11 2.267 10.507 1 8.5 1 6.5 1 6 2.27 6 4.49V5l5-.002V4.49z" fill="currentColor"></path>
                            </svg>
                          </button>
                          {
                            cart?.length
                              ? (
                                <div className='bg-button w-5 h-5 absolute top-2 ml-3 flex rounded-full'>
                                  <span className='m-auto text-xs text-white'>{cart.reduce((prev, curr) => prev + curr.quantity, 0)}</span>
                                </div>
                              )
                              : ''
                          }
                        </div>
                        )
                      : (
                        <button className='h-full flex mr-2' onClick={() => {
                          setCartPosition('-mt-[180px]')
                          setTimeout(() => {
                            setCartView('hidden')
                          }, 400)
                        }}>
                          <svg className="m-auto w-[17px]" role="presentation" viewBox="0 0 16 14">
                            <path d="M15 0L1 14m14 0L1 0" stroke="currentColor" fill="none" fill-rule="evenodd"></path>
                          </svg>
                        </button>
                      )
                  }
                </div>
                <div className='flex px-2 w-full justify-between gap-4 sm:hidden'>
                  <div className='flex w-full gap-4'>
                    {
                      menu === 'w-0 pl-0 pr-0 pt-6 pb-6'
                        ? <button onClick={() => {
                            setIndex('flex')
                            setTimeout(() => {
                              setMenuButtons('opacity-1')
                            }, 270)
                          }}>
                          <svg className="w-5" role="presentation" viewBox="0 0 20 14">
                            <path d="M0 14v-1h20v1H0zm0-7.5h20v1H0v-1zM0 0h20v1H0V0z" fill="currentColor"></path>
                          </svg>
                        </button>
                        : <button onClick={() => {
                            setMenu('w-0 pl-0 pr-0 pt-6 pb-6')
                            setMenuButtons('opacity-0')
                            setTimeout(() => {
                              setIndex('hidden')
                            }, 150)
                          }} className='flex w-5'>
                          <svg className="m-auto w-[17px]" role="presentation" viewBox="0 0 16 14">
                            <path d="M15 0L1 14m14 0L1 0" stroke="currentColor" fill="none" fill-rule="evenodd"></path>
                          </svg>
                        </button>
                    }
                  </div>
                  <div className='flex gap-2 sm:hidden'>
                    {
                      storeData?.logo && storeData?.logo.url !== ''
                        ? <Link href='/'><Image className='max-w-[110px] min-w-[110px] py-0.5' src={`${storeData.logo.url}`} alt='Logo' width={155} height={53.72} /></Link>
                        : <Link href='/'><div className='h-[42px] flex'><p className='m-auto text-xl font-semibold'>TIENDA</p></div></Link>
                    }
                  </div>
                  <div className='flex w-full justify-end gap-4'>
                    {
                      accountView === 'hidden'
                        ? (
                          <button onClick={(e: any) => {
                            e.preventDefault()
                            setAccountView('flex')
                            setTimeout(() => {
                              setAccountPosition('')
                            }, 10)
                          }}>
                            <svg width="21" height="19" viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="10.9531" cy="6" r="5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></circle>
                              <path d="M20.4906 18C19.2164 13.9429 15.4261 11 10.9484 11C6.47081 11 2.68051 13.9429 1.40625 18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                          </button>
                        )
                        : (
                          <button onClick={(e: any) => {
                            e.preventDefault()
                            setAccountPosition('-mt-[360px]')
                            setTimeout(() => {
                              setAccountView('hidden')
                            }, 500)
                          }}>
                            <svg className="m-auto w-[21px] px-[2px]" role="presentation" viewBox="0 0 16 14">
                              <path d="M15 0L1 14m14 0L1 0" stroke="currentColor" fill="none" fill-rule="evenodd"></path>
                            </svg>
                          </button>
                        )
                    }
                    {
                      cartView === 'hidden'
                        ? (
                          <div>
                            <button onClick={() => {
                              setCartView('flex')
                              setTimeout(() => {
                                setCartPosition('')
                              }, 10)
                            }} className='flex h-full'>
                              <svg className='m-auto cursor-pointer w-[17px]' role="presentation" viewBox="0 0 17 20">
                                <path d="M0 20V4.995l1 .006v.015l4-.002V4c0-2.484 1.274-4 3.5-4C10.518 0 12 1.48 12 4v1.012l5-.003v.985H1V19h15V6.005h1V20H0zM11 4.49C11 2.267 10.507 1 8.5 1 6.5 1 6 2.27 6 4.49V5l5-.002V4.49z" fill="currentColor"></path>
                              </svg>
                            </button>
                            {
                              cart?.length
                                ? (
                                  <div className='bg-button w-5 h-5 absolute top-2 ml-3 flex rounded-full'>
                                  <span className='m-auto text-xs text-white'>{cart.reduce((prev, curr) => prev + curr.quantity, 0)}</span>
                                </div>
                                )
                                : ''
                            }
                          </div>
                          )
                        : (
                          <button onClick={() => {
                            setCartPosition('-mt-[180px]')
                            setTimeout(() => {
                              setCartView('hidden')
                            }, 300)
                          }} className='flex h-full'>
                            <svg className="m-auto w-[17px]" role="presentation" viewBox="0 0 16 14">
                              <path d="M15 0L1 14m14 0L1 0" stroke="currentColor" fill="none" fill-rule="evenodd"></path>
                            </svg>
                          </button>
                        )
                    }
                  </div>
                </div>
              </>
              : <div className='flex gap-4 justify-between'>
                <div className='gap-2 flex sm:hidden'>
                {
                  storeData?.logo && storeData?.logo.url !== ''
                    ? <Link href='/'><Image className='max-w-[110px] min-w-[110px] py-0.5' src={`${storeData.logo.url}`} alt='Logo' width={155} height={53.72} /></Link>
                    : <Link href='/'><div className='h-[42px] flex'><p className='m-auto text-xl font-semibold'>TIENDA</p></div></Link>
                }
                </div>
                <Link href='/tienda' className='mt-auto mb-auto text-sm text-neutral-500'>Continuar comprando</Link>
              </div>
          }
          </div>
        </div>
        <div className={`${accountView} ${accountPosition} transition-all duration-500 w-full -z-10 absolute top-[51px] sm:hidden`} style={{ height: 'calc(100vh - 91px)' }}>
          <div className='w-full px-4 ml-auto mr-auto'>
            <div className='ml-auto h-fit flex w-full 400:w-96'>
              <AccountLogin account={account} setAccount={setAccount} setAccountPc={setAccountPc} setAccountView={setAccountView} setAccountPosition={setAccountPosition} />
            </div>
            <div onClick={() => {
              setAccountPosition('-mt-[360px]')
              setTimeout(() => {
                setAccountView('hidden')
              }, 500)
            }} className='h-full w-full' />
          </div>
        </div>
        <div onClick={() => {
          if (accountPc) {
            setAccountPosition('-mt-[360px]')
            setTimeout(() => {
              setAccountView('hidden')
            }, 500)
          }
        }} className={`hidden ${accountPosition} w-full -z-10 transition-all duration-300 absolute top-[53px] sm:${accountView}`} style={{ height: 'calc(100vh - 91px)' }}>
          <div className='w-[1770px] ml-auto mr-auto'>
            <div className='ml-auto h-fit flex w-full 400:w-96'>
              <AccountLogin account={account} setAccount={setAccount} setAccountPc={setAccountPc} setAccountView={setAccountView} setAccountPosition={setAccountPosition} />
            </div>
          </div>
        </div>
        <div className={`${cartView} ${cartPosition} transition-all duration-300 w-full -z-10 absolute top-[51px] sm:hidden`} style={{ height: 'calc(100vh - 91px)' }}>
          <div className='w-full px-4 ml-auto mr-auto'>
            <div className='ml-auto h-fit flex w-full sm:w-96'>
              <NavbarCart setCartView={setCartView} setCartPosition={setCartPosition} />
            </div>
            <div onClick={() => {
              setCartPosition('-mt-[180px]')
              setTimeout(() => {
                setCartView('hidden')
              }, 300)
            }} className='h-full w-full' />
          </div>
        </div>
        <div onClick={() => {
          if (cartPc) {
            setCartPosition('-mt-[180px]')
            setTimeout(() => {
              setCartView('hidden')
            }, 300)
          }
        }} className={`hidden ${cartPosition} -z-10 transition-all duration-300 absolute top-[53px] w-full sm:${cartView}`} style={{ height: 'calc(100vh - 91px)' }}>
          <div className='w-[1850px] ml-auto mr-auto'>
            <div className='ml-auto h-fit flex w-full sm:w-96'>
              <NavbarCart setCartView={setCartView} setCartPc={setCartPc} setCartPosition={setCartPosition} />
            </div>
          </div>
        </div>
        <div className={`${index} w-full absolute z-30 justify-between 530:hidden`} style={{ top: '51px', height: 'calc(100vh - 49px)' }}>
          <div className={`${menu} shadow-md transition-all duration-300 bg-white overflow-hidden dark:bg-neutral-900`}>
            <Link className={`${menuButtons} transition-opacity duration-200 mb-4 font-medium text-[#1c1b1b] flex pb-2 min-w-[250px] border-b dark:border-neutral-600 dark:text-white`} onClick={() => {
              setMenu('w-0 pl-0 pr-0 pt-6 pb-6')
              setMenuButtons('opacity-0')
              setTimeout(() => {
                setIndex('hidden')
              }, 150)
            }} href='/'>Inicio<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" className="ml-auto w-4 text-lg text-neutral-500" xmlns="http://www.w3.org/2000/svg"><path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 0 0 302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 0 0 0-50.4z"></path></svg></Link>
            <div className={`${menuButtons} transition-opacity duration-200 border-b mb-4 min-w-[250px] dark:border-neutral-600`}>
              <div className={`flex justify-between pb-2`}>
                <Link onClick={() => {
                  setMenu('w-0 pl-0 pr-0 pt-6 pb-6')
                  setMenuButtons('opacity-0')
                  setTimeout(() => {
                    setIndex('hidden')
                  }, 150)
                }} className='font-medium text-[#1c1b1b] w-full dark:text-white' href='/tienda'>Tienda</Link>
                {
                  categories.length
                    ? <button onClick={() => rotate === 'rotate-90' ? setRotate('-rotate-90') : setRotate('rotate-90')}><svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" className={`${rotate} transition-all duration-150 ml-auto text-lg w-4 text-neutral-500`} xmlns="http://www.w3.org/2000/svg"><path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 0 0 302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 0 0 0-50.4z"></path></svg></button>
                    : <Link href='/tienda' onClick={() => {
                      setMenu('w-0 pl-0 pr-0 pt-6 pb-6')
                      setMenuButtons('opacity-0')
                      setTimeout(() => {
                        setIndex('hidden')
                      }, 150)
                    }}><svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" className="ml-auto w-4 text-lg text-neutral-500" xmlns="http://www.w3.org/2000/svg"><path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 0 0 302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 0 0 0-50.4z"></path></svg></Link>
                }
              </div>
              <div ref={categoriesPhoneRef} style={{ maxHeight: `${categoriesPhone}px`, overflow: 'hidden', transition: 'max-height 0.2s' }} className={`${categoriesPhone} flex flex-col`}>
                {
                  categories?.length
                    ? categories.map(category => (
                      <Link onClick={() => {
                        setMenu('w-0 pl-0 pr-0 pt-6 pb-6')
                        setMenuButtons('opacity-0')
                        setTimeout(() => {
                          setIndex('hidden')
                        }, 150)
                      }} href={`/tienda/${category.slug}`} className='flex gap-2 mb-2' key={category._id}>
                        <Image className='w-28 rounded-md h-auto' src={category.image?.url!} width={112} height={112} alt={`Categoria ${category.category}`} />
                        <p className='mt-auto text-[#1c1b1b] font-medium mb-auto dark:text-white'>{category.category}</p>
                      </Link>
                    ))
                    : ''
                }
              </div>
            </div>
            <Link className={`${menuButtons} transition-opacity duration-200 mb-4 text-[#1c1b1b] font-medium flex pb-2 min-w-[250px] border-b dark:border-neutral-600 dark:text-white`} onClick={() => {
              setMenu('w-0 pl-0 pr-0 pt-6 pb-6')
              setMenuButtons('opacity-0')
              setTimeout(() => {
                setIndex('hidden')
              }, 140)
            }} href='/blog'>Blog<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" className="ml-auto w-4 text-lg text-neutral-500" xmlns="http://www.w3.org/2000/svg"><path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 0 0 302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 0 0 0-50.4z"></path></svg></Link>
            <Link className={`${menuButtons} transition-opacity duration-200 mb-4 text-[#1c1b1b] font-medium flex pb-2 min-w-[250px] border-b dark:border-neutral-600 dark:text-white`} onClick={() => {
              setMenu('w-0 pl-0 pr-0 pt-6 pb-6')
              setMenuButtons('opacity-0')
              setTimeout(() => {
                setIndex('hidden')
              }, 140)
            }} href='/contacto'>Contacto<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" className="ml-auto w-4 text-lg text-neutral-500" xmlns="http://www.w3.org/2000/svg"><path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 0 0 302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 0 0 0-50.4z"></path></svg></Link>
          </div>
          <div className='w-1/6' onClick={() => {
            setMenu('w-0 pl-0 pr-0 pt-6 pb-6')
            setMenuButtons('opacity-0')
            setTimeout(() => {
              setIndex('hidden')
            }, 150)
          }} />
        </div>
        <div className={`${navCategories} ${navCategoriesOpacity} -z-10 border-t box-border transition-all duration-200 absolute top-[53px] w-full dark:border-neutral-800`} onMouseEnter={() => {
          setMouseEnter(true)
          setNavCategories('flex')
          setNavCategoriesOpacity('opacity-1 -mt-[1px]')
        }} onMouseLeave={() => {
          setNavCategoriesOpacity('opacity-0 -mt-[30px]')
          setTimeout(() => {
            setNavCategories('hidden')
          }, 200)
        }}>
          {
            categories?.length
              ? (
                <div className='w-full bg-white p-4 flex gap-4 border-b justify-center dark:bg-neutral-900 dark:border-neutral-800'>
                  {categories.map(category => (
                    <div key={category._id}>
                      <Image className='w-64 rounded-md h-auto mb-2 cursor-pointer' onClick={() => {
                        setNavCategoriesOpacity('opacity-0 -mt-[30px]')
                        setTimeout(() => {
                          setNavCategories('hidden')
                        }, 200)
                        router.push(`/tienda/${category.slug}`)
                      }} src={category.image?.url!} width={256} height={256} alt={`Categoria ${category.category}`} />
                      <Link href={`/tienda/${category.slug}`} onClick={() => {
                        setNavCategoriesOpacity('opacity-0 -mt-[30px]')
                        setTimeout(() => {
                          setNavCategories('hidden')
                        }, 200)
                      }} className='m-auto font-medium text-[#1c1b1b] dark:text-white'>{category.category}</Link>
                    </div>
                  ))}
                </div>
              )
              : ''
          }
        </div>
      </div>
      { children }
    </div>
    </>
  )
}
