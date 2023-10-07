export interface Chat {
    id:number,
    id_message_parent:number|null,
    id_from:number,
    id_to:number,
    message:string
}