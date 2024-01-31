export interface IPost {
    _id?: string
    title: string
    content: string,
    state: boolean
    image: { public_id: string, url: string }
    description: string
    titleSeo?: string
    descriptionSeo?: string

    createdAt?: Date
    updatedAt?: Date
}