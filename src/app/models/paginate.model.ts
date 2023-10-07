import { ActionToPaginate } from "./system.enum"

export interface Paginate{
    registers: number,
    page:number,
    per_page:number,
    pages:number,
    has_next:boolean
}

export interface PaginateAction{
    action: ActionToPaginate,
    page:number
}

export interface RequestResponse{
    pagination: Paginate,
    data: any
}

export interface ResponseError{
    error_code: string,
    error_details: string,
    error_sql: string
}

export interface Options{
    page:number,
    pageSize:number,
    query:string
}