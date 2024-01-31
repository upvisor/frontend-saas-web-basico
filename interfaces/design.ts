export interface IDesign {
    header: {
        topStrip: String
    }
    home: {
        banner: IBanner[],
        category: {
            titleCategory: boolean
            title: string
            descriptionCategory: boolean
        },
        products: {
            title: string
            sectionProducts: string
            category?: string
        },
        seo: {
            metaTitle: string
            metaDescription: string
        }
    }
    product: {
        titleInfo: string
        textInfo: string
        title: string
        sectionProducts: string
        category?: string
    }
    contact: {
        title: string
        text: string
        titleForm: string
    }
    shop: {
        title: string
        description: string
        banner?: { public_id: string, url: string }
        metaTitle: string
        metaDescription: string
    }
    subscription: {
        title: string
    }
    cart: {
        title: string
        sectionProducts: string
        category?: string
    }
    blog: {
        metaTitle: string
        metaDescription: string
    }
    popup: {
        title: string
        description: string
        tag: string
    }
}

export interface IBanner {
    image: { public_id: string, url: string }
    title: string
    text: string
    textButton: string
    linkButton: string
}