import { Paginate } from "./paginate.model"

export interface User {
    id:number,
    username:string,
    name:string|null,
    type:string,
    active: boolean
    password: string | undefined,
    date_created: string | undefined,
    date_updated: string | undefined,
}

export interface UserResponse{
    pagination: Paginate
    data: User[]
}