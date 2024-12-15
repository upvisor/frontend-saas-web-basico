import { Design, IFunnel, IPost } from "@/interfaces"
import { MetadataRoute } from "next"

export const revalidate = 3600

async function fetchDesign () {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/design`)
    return res.json()
}

async function fetchPosts () {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`)
    return res.json()
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

    const design: Design = await fetchDesign()

    const posts: IPost[] = await fetchPosts()

    const pagesEntries: MetadataRoute.Sitemap = design.pages.map(page => ({
        url: `${process.env.NEXT_PUBLIC_WEB_URL}/${page.slug}`,
        lastModified: new Date(page.updatedAt!),
        changeFrequency: 'weekly',
        priority: page.slug === '' ? 1 : 0.6
    }))

    const postsEntries: MetadataRoute.Sitemap = posts.map(post => ({
        url: `${process.env.NEXT_PUBLIC_WEB_URL}/blog/${post._id}`,
        lastModified: new Date(post.updatedAt!),
        changeFrequency: 'weekly',
        priority: 0.8
    }))

    return [
        ...pagesEntries,
        {
            url: `${process.env.NEXT_PUBLIC_WEB_URL}/blog`,
            lastModified: new Date(),
            changeFrequency: 'yearly'
        },
        ...postsEntries
    ]
}