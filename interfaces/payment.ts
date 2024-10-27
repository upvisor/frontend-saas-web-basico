export interface IPayment {
    transbank: {
        active?: boolean
        commerceCode?: string
        apiKey?: string
    },
    mercadoPago: {
        active?: boolean
        accessToken?: string
        publicKey?: string
    }
}