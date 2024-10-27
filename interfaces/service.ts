import { IBanner } from "./design"

export interface IService {
    _id?: string
    name: string
    description?: string
    steps: { _id?: string, step: string, slug?: string }[]
    typeService: string
    typePrice: string
    price?: string
    plans?: IPlans
    tags?: string[]

    createdAt?: Date
    updatedAt?: Date
}

export interface IPlans {
    functionalities: string[]
    plans: IPlan[]
}

export interface IPlan {
    _id?: string
    name: string
    description?: string
    price: string
    functionalities?: { name: string, value: string }[]
}

export interface IStepService {
    _id?: string
    step: string
    slug?: string
    metaTitle?: string
    metaDescription?: string
    image?: string
    design?: { content: string, meetings?: string[], meeting?: string, form?: string, service?: { service: string, plan?: string }, info: IInfoService }[]
}

export interface IInfoService {
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
}