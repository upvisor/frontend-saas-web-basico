import PagePost from "@/components/blog/PagePost"
import { IPost } from "@/interfaces"
import { Metadata } from "next"

async function fetchPost (post: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/${post}`, { next: { revalidate: 3600 } })
  return res.json()
}

async function fetchPosts () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, { next: { revalidate: 3600 } })
  return res.json()
}

export async function generateMetadata({
  params
}: {
  params: { post: string }
}): Promise<Metadata> {

  const id = params.post
  const post: IPost = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/${id}`, { next: { revalidate: 3600 } }).then((res) => res.json())

  return {
    title: post.titleSeo && post.titleSeo !== '' ? post.titleSeo : post.title,
    description: post.descriptionSeo && post.descriptionSeo !== '' ? post.descriptionSeo : '',
    openGraph: {
      title: post.titleSeo && post.titleSeo !== '' ? post.titleSeo : post.title,
      description: post.descriptionSeo && post.descriptionSeo !== '' ? post.descriptionSeo : '',
      images: [post.image && post.image !== '' ? post.image : ''],
    },
  }
}

export default async function Page ({ params }: { params: { post: string } }) {
  
  const postData = fetchPost(params.post)

  const postsData = fetchPosts()

  const [post, posts] = await Promise.all([postData, postsData])

  return (
    <PagePost post={post} posts={posts} />
  )
}