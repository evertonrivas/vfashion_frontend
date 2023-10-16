import { Paginate } from "./paginate.model"

export interface OrderProduct{
    id_product:number,
    color:string,
    size:string,
    quantity:string,
    price:number,
    discount:number,
    discount_percentage: number
}

export interface Order{
    id_customer:number,
    make_online:boolean,
    id_payment_condition:number,
    products: OrderProduct[]
}

export interface OrderHistory{
    id_order:number,
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
    track_code:string|null
    date_created:string
}

export interface CartItem{
    id_customer: number,
    id_product: number,
    color: string,
    size: string,
    quantity: number,
    price:string
}

export interface CartSize{
    name:string,
    quantity:number
}

export interface CartColor{
    name: string,
    hexa: string,
    code:string,
    sizes: CartSize[]
}

export interface CartContent{
    id_product: number,
    ref: string,
    name: string,
    img_url: string,
    price_un:string,
    total_price:string,
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
