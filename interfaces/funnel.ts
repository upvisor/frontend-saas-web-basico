import { IBanner, IDesign } from "./design"

export interface IFunnel {
    _id?: string
    funnel: string
    description?: string
    slug: string
    steps: IStep[]
    service?: string
}

export interface IStep {
    _id?: string
    step: string
    slug: string
    metaTitle?: string
    metaDescription?: string
    image?: string
    design: IDesign[]

    createdAt?: Date
    updatedAt?: Date
}

export interface IInfoFunnel {
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
    video?: string
    banner?: IBanner[]
    typeBackground?: string
    background?: string
    textColor?: string
    faq?: [{ question?: string, response?: string }]
}