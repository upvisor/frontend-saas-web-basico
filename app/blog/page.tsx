import { PageBlog } from '@/components/blog'
import { IDesign, IPost } from '@/interfaces'
import { Metadata } from 'next'

export const revalidate = 60

async function fetchPosts () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`)
  return res.json()
}

export async function generateMetadata(): Promise<Metadata> {
  const design: IDesign = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/design`).then(res => res.json())

  return {
    title: design.blog?.metaTitle && design.blog?.metaTitle !== '' ? design.blog.metaTitle : 'Blog',
    description: design.blog?.metaDescription && design.blog?.metaDescription !== '' ? design.blog.metaDescription : 'Esta es la pagina de blog de mi tienda',
    openGraph: {
      title: design.blog?.metaTitle && design.blog?.metaTitle !== '' ? design.blog.metaTitle : 'Blog',
      description: design.blog?.metaDescription && design.blog?.metaDescription !== '' ? design.blog.metaDescription : 'Esta es la pagina de blog de mi tienda',
    }
  }
}

export default async function Page () {

  const posts: IPost[] = await fetchPosts()

  return (
    <PageBlog posts={posts} />
  )
}