export interface Funnel {
    id:number,
    name:string,
    is_default:boolean,
    type:string,
    stages: FunnelStage[],
    date_created:string,
    date_updated:string|null
}

export interface FunnelStage{
    id: number,
    id_funnel:number,
    name:string,
    icon:string,
    icon_color:string,
    color:string,
    order:number,
    date_created:string,
    date_updated:string|null
}