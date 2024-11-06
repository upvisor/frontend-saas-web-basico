import { PageBlog } from '@/components/blog'
import { IPost } from '@/interfaces'

async function fetchPosts () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, { next: { revalidate: 3600 } })
  return res.json()
}

export default async function Page () {

  const posts: IPost[] = await fetchPosts()

  return (
    <PageBlog posts={posts} />
  )
}