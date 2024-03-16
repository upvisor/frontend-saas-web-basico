export interface Design {
    header: IHeader
    pages: IPage[]
    productPage: IProductPage
    categoryPage: ICategoryPage[]
}

export interface IHeader {
    topStrip: string
}

export interface IPage {
    page: string
    slug: string
    header: boolean
    metaTitle?: string
    metaDescription?: string
    design: IDesign[]
}

export interface IProductPage {
    title: string
    text: string
}

export interface ICategoryPage {
    design: IDesign[]
}

export interface IDesign {
    content: string
    info: IInfo
}

export interface IInfo {
    title?: string
    subTitle?: string
    description?: string
    image?: { public_id: string, url: string }
    titleForm?: string
    button?: string
    buttonLink?: string
    subTitle2?: string
    description2?: string
    button2?: string
    buttonLink2?: string
    subTitle3?: string
    description3?: string
    button3?: string
    buttonLink3?: string
    descriptionView?: boolean
    products?: string
    banner?: IBanner[]
}

export interface IBanner {
    title?: string
    description?: string
    button?: string
    buttonLink?: string
    image?: { public_id: string, url: string }
}