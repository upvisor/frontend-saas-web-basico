export interface IMessage {
    senderId?: string
    agent: boolean
    message?: string
    response?: string
    adminView?: boolean
    userView?: boolean
    shop?: number

    createdAt?: Date
    updatedAt?: Date
}