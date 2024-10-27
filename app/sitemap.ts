import { Design, IFunnel, IPost } from "@/interfaces";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

    const design: Design = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/design`, { cache: "no-store" }).then((res) => res.json())

    const funnels: IFunnel[] = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/funnels`, { cache: "no-store" }).then((res) => res.json())

    const posts: IPost[] = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, { cache: "no-store" }).then((res) => res.json())

    const pagesEntries: MetadataRoute.Sitemap = design.pages.map(page => ({
        url: `${process.env.NEXT_PUBLIC_WEB_URL}/${page.slug}`,
        lastModified: new Date(page.updatedAt!),
        changeFrequency: 'weekly',
        priority: page.slug === '' ? 1 : 0.6
    }))

    const stepsEntries: MetadataRoute.Sitemap = funnels.map(funnel => ({
        url: `${process.env.NEXT_PUBLIC_WEB_URL}/${funnel.steps[0].slug}`,
        lastModified: new Date(funnel.steps[0].updatedAt!),
        changeFrequency: 'weekly',
        priority: 0.8
    }))

    const postsEntries: MetadataRoute.Sitemap = posts.map(post => ({
        url: `${process.env.NEXT_PUBLIC_WEB_URL}/blog/${post._id}`,
        lastModified: new Date(post.updatedAt!),
        changeFrequency: 'weekly',
        priority: 0.8
    }))

    return [
        ...pagesEntries,
        ...stepsEntries,
        {
            url: `${process.env.NEXT_PUBLIC_WEB_URL}/blog`,
            lastModified: new Date(),
            changeFrequency: 'yearly'
        },
        ...postsEntries
    ]
}