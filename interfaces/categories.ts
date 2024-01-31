export interface ICategory {
  _id: string
  category: string
  slug: string
  image?: { public_id: string, url: string }
  banner?: { public_id: string, url: string }
  description: string
  titleSeo?: string
  descriptionSeo?: string
  
  createdAt: string
  updatedAt: string
}