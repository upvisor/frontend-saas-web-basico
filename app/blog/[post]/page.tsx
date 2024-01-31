import PagePost from "@/components/blog/PagePost"
import { IPost } from "@/interfaces"
import { Metadata } from "next"

export const revalidate = 60

async function fetchPost (post: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/${post}`)
  return res.json()
}

async function fetchPosts () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`)
  return res.json()
}

export async function generateMetadata({
  params
}: {
  params: { post: string }
}): Promise<Metadata> {

  const id = params.post
  const post: IPost = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/${id}`).then((res) => res.json())

  return {
    title: post.titleSeo,
    description: post.descriptionSeo,
    openGraph: {
      title: post.titleSeo,
      description: post.descriptionSeo,
      images: [post.image?.url ? post.image?.url : ''],
    },
  }
}

export default async function Page ({ params }: { params: { post: string } }) {
  
  const post: IPost = await fetchPost(params.post)

  const posts: IPost[] = await fetchPosts()

  return (
    <PagePost post={post} posts={posts} />
  )
}