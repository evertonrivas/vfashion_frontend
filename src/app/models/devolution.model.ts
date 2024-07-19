import { DevolutionStatus } from "./system.enum"

export interface Reason {
    id:number,
    description:string|undefined,
    date_created:string|undefined,
    date_updated:string|undefined
}

export interface DevolutionItem{
    id_devolution_item: string,
    id_product: number,
    name_product: string,
    id_color: number,
    name_color: string,
    id_size: number,
    name_size: string
    id_reason: number,
    reason: string,
    quantity: number,
    status: boolean|undefined,
    picture_1: string,
    picture_2: string,
    picture_3: string,
    picture_4: string
}

export interface Devolution{
    id:number,
    id_order:number,
    order_date:Date|undefined,
    status: DevolutionStatus|undefined,
    customer:string|undefined,
    date: Date|undefined,
    items: DevolutionItem[]
}

export interface Step{
    id:number,
    name:string,
    date_created:string|undefined,
    date_updated:string|undefined
}