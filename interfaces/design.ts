export interface Design {
    _id?: string
    header?: IHeader
    pages: IPage[]
    popup?: IPopupWeb
    whatsapp?: boolean
}

export interface IHeader {
    topStrip: string
}

export interface IPage {
    _id?: string
    page: string
    slug: string
    header: boolean
    button?: boolean
    metaTitle?: string
    metaDescription?: string
    image?: string
    subPage?: { page?: string, slug?: string }[]
    design: IDesign[]

    createdAt?: Date
    updatedAt?: Date
}

export interface IPopupWeb {
    active: boolean
    wait: number
    title: string
    description: string
    content?: string
    buttonText?: string
    buttonLink?: string
}

export interface IDesign {
    content: string
    info: IInfo
    meetings?: string[]
    meeting?: string
    form?: string
    service?: { service: string, plan?: string }
    services?: { service: string, url: string }[]
}

export interface IInfo {
    title?: string
    subTitle?: string
    description?: string
    image?: string
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
    video?: string
    typeBackground?: string
    background?: string
    textColor?: string
    faq?: [{ question?: string, response?: string }]
    blocks?: [{ title?: string, description?: string, buttonText?: string, buttonLink?: string }]
    reviews?: [{ review?: string, stars?: string, name?: string }]
}

export interface IBanner {
    title?: string
    description?: string
    button?: string
    buttonLink?: string
    image?: string
}