import { IPost } from '@/interfaces'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { H1, H2 } from '../ui'

export const PageBlog = ({ posts }: { posts: IPost[] }) => {
  return (
    <div className="w-full flex p-4">
      <div className="w-full max-w-[1600px] m-auto flex flex-col gap-4">
        <H1>BLOG</H1>
        <H2>ULTIMOS POSTS</H2>
        <div className='flex flex-wrap gap-4 w-full'>
          {
            posts.length
              ? posts.map(post => (
                <div key={post._id} className='flex w-[300px]'>
                  <Link href={`/blog/${post._id}`} className='flex flex-col gap-2'>
                    {
                      post.image.url && post.image.url !== ''
                        ? <Image src={post.image.url} alt={`Imagen post ${post.title}`} width={300} height={300} />
                        : ''
                    }
                    <p className='text-lg font-medium'>{post.title}</p>
                    <p className='text-sm'>{post.description}</p>
                  </Link>
                </div>
              ))
              : <p>No hay posts</p>
          }
        </div>
      </div>
    </div>
  )
}
