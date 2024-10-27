export interface IClient {
  _id?: string
  firstName?: string
  lastName?: string
  email: string
  phone?: string
  funnels?: IFunnelClient[]
  services?: IServiceClient[]
  forms?: IFormClient[]
  meetings?: IMeetingClient[]
  tags?: string[]
  emails?: IEmail[]
  data?: { name: string, value: string }[]
  [key: string]: any

  createdAt?: Date
  updatedAt?: Date
}

export interface IClientTag {
  tag: string
}

export interface IClientData {
  name: string
  data: string
}

export interface IFunnelClient {
  funnel: string
  step: string
}

export interface IServiceClient {
  service?: string
  step?: string
  plan?: string
  price?: string
  payStatus?: string
}

export interface IFormClient {
  form: string
}

export interface IMeetingClient {
  meeting: string
}

export interface IEmail {
  id: string
  subject: string
  opened: boolean
  clicked: boolean
}