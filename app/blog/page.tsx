import { PageBlog } from '@/components/blog'
import { IDesign, IPost } from '@/interfaces'
import { Metadata } from 'next'

export const revalidate = 60

async function fetchPosts () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`)
  return res.json()
}

export default async function Page () {

  const posts: IPost[] = await fetchPosts()

  return (
    <PageBlog posts={posts} />
  )
}