export interface IClient {
  _id?: string
  firstName?: string
  lastName?: string
  email: string
  phone?: string
  address?: string
  departament?: string
  region?: string
  city?: string
  tags?: string[]
}

export interface IClientTag {
  tag: string
}