import { Paginate } from "./paginate.model"
import { City } from "./place.model"
import { CustomerAction, EntityType } from "./system.enum"
import { User } from "./user.model"

export interface RepEntity{
    id:number,
    origin_id: number,
    name:string,
    fantasy_name:string,
    taxvat:string,
    city: City,
    contacts: EntityContact[],
    web: EntityWeb[],
    postal_code:string,
    neighborhood:string,
    address:string,
    type:string,
    date_created: string | undefined,
    date_updated: string | undefined
}

export interface Entity {
    id:number,
    origin_id: number,
    name:string,
    fantasy_name:string,
    taxvat:string,
    city: City,
    agent: RepEntity | null,
    contacts: EntityContact[],
    web: EntityWeb[],
    files: EntityFile[],
    postal_code:string,
    neighborhood:string,
    address:string,
    type:string,
    date_created: string | undefined,
    date_updated: string | undefined
}

export interface EntityResponse{
    pagination: Paginate
    data: Entity[]
}

export interface HistoryResponse{
    pagination: Paginate
    data: EntityHistory[]
}

export interface EntityContact{
    id:number,
    id_legal_entity:number,
    name:string,
    contact_type:string,
    value:string,
    is_whatsapp:boolean,
    is_default:boolean
}

export interface EntityWeb{
    id:number,
    id_legal_entity:number,
    name:string,
    web_type:string,
    value:string
}

export interface EntityFile{
    id:number,
    name:string,
    folder:string,
    content_type:string
}

export interface EntityHistory{
    id:number,
    id_legal_entity:number,
    history:string,
    action:CustomerAction,
    date_created:string
}

export interface EntityNotification{
    moment:Date,
    user:User,
    remember:string,
}

export { EntityType }
