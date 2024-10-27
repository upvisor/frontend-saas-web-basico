export interface IPost {
    _id?: string
    title: string
    content: string,
    state: boolean
    image: string
    description: string
    titleSeo?: string
    descriptionSeo?: string

    createdAt?: Date
    updatedAt?: Date
}