import { Paginate } from "./paginate.model"

export interface OrderProduct{
    id_product:number,
    name:string,
    id_color:number,
    color:string,
    id_size:number,
    size:string,
    quantity:string,
    price:number,
    discount:number,
    discount_percentage: number
}

export interface Order{
    id:number,
    customer:{
        id:number,
        name:string
    }|undefined,
    payment_condition:{
        id:number,
        name:string
    }|undefined,
    total_value:number,
    total_itens:number,
    installments: number,
    installments_value: number,
    integrated: boolean,
    integration_number: number|undefined,
    track_code: string|undefined,
    track_company: string|undefined,
    invoice_number: number|undefined,
    invoice_serie:number|undefined,
    date_created: string,
    date_updated: string,
    products: OrderProduct[]
}

export interface TrackStatus{
    date:string,
    status:string
}

export interface TrackOrder{
    shipping:string,
    forecast:string,
    timeline: TrackStatus[]
}

export interface OrderHistory{
    id_order:string,
    id_customer:number,
    customer_name:string,
    id_payment_condition: number,
    payment_name:string,
    total_value:number,
    total_itens:number,
    installments: number,
    installment_value:number,
    integrated:boolean,
    integration_number:number|null,
    invoice_number:number|null,
    track:TrackOrder|null,
    date_created:string
}

export interface CartItem{
    id_customer: number,
    id_product: number,
    id_color: number,
    id_size: number,
    quantity: number,
    price:number,
    user_create: number,
    date_create: Date,
    user_update: number|null,
    date_update: Date|null
}

export interface CartSize{
    id:number,
    name:string,
    quantity:number
}

export interface CartColor{
    id: number,
    name: string,
    hexa: string,
    code:string,
    sizes: CartSize[]
}

export interface CartContent{
    id_product: number,
    id_customer: number,
    fantasy_name:string,
    ref: string,
    name: string,
    img_url: string,
    price_un:number,
    total_price:number,
    itens:number,
    colors:CartColor[]
}

export interface PaymentCondition{
    id:number,
    name:string,
    received_days: number,
    installments: number
}

export { Paginate }
