"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { IPost } from '@/interfaces'
import Link from 'next/link'
import { H1 } from '../ui'

const PagePost = ({ post, posts }: { post: IPost, posts: IPost[] }) => {

  const [postsFiltered, setPostsFiltered] = useState<IPost[]>([])

  const filterPosts = () => {
    const filter = posts.filter(p => p._id !== post._id)
    setPostsFiltered(filter)
  }

  useEffect(() => {
    filterPosts()
  }, [posts])

  return (
    <div className="w-full px-2 py-8 flex">
      <div className="w-[1360px] m-auto flex flex-col gap-8 1280:flex-row">
        <div className={`flex flex-col gap-4 w-full ${postsFiltered.length ? '' : 'm-auto'} 1280:w-2/3`}>
          {
            post.image && post.image !== ''
              ? <Image src={post.image} alt={`Imagen principal post ${post.title}`} className="m-auto" width={500} height={500} />
              : ''
          }
          <H1 text={post.title} />
          <div className='flex flex-col gap-4' dangerouslySetInnerHTML={{ __html: post.content.replace('<h1>', '<h1 class="text-[25px] font-medium tracking-wide lg:text-[32px]">').replace('<h2>', '<h2 class="text-[20px] font-medium tracking-wide lg:text-[24px]">').replace('<h3>', '<h3 class="font-medium tracking-wide text-[16px] lg:text-[20px]">') }} />
          <div className='flex flex-col gap-2 mt-2'>
            <p className='font-medium'>Compartir</p>
            <div className='flex gap-2'>
              <Link href='https://facebook.com/'>Facebook</Link>
              <Link href='https://twitter.com'>Twitter</Link>
            </div>
          </div>
        </div>
        {
          postsFiltered.length
            ? (
              <div className="w-full flex flex-col gap-4 1280:w-1/3">
                <h5 className="text-lg font-medium tracking-wide">POST RECOMENDADOS</h5>
                <div className='flex flex-row gap-2 1280:flex-col'>
                  {
                    postsFiltered.map(post => (
                      <div key={post._id} className="w-full">
                        <Link href={`/blog/${post._id}`} className="flex gap-2">
                          <Image src={post.image} alt={`Imagen post ${post.title}`} className="h-fit my-auto" width={200} height={200} />
                          <div className="flex flex-col gap-2 my-auto">
                            <p className="text-lg font-medium">{post.title}</p>
                            <p className="text-sm">{post.description}</p>
                          </div>
                        </Link>
                      </div>
                    ))
                  }
                </div>
              </div>
            )
            : ''
        }
      </div>
    </div>
  )
}

export default PagePost