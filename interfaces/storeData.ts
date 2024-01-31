export interface IStoreData {
    _id?: string
    name: string
    email: string
    phone: string
    address: string
    departament?: string
    region: string
    city: string
    logo: { public_id: string, url: string }
    logoWhite: { public_id: string, url: string }
    instagram?: string
    facebook?: string
    tiktok?: string
}