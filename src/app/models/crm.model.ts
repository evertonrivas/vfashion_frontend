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
    name:string,
    icon:string,
    color:string,
    order:number,
    date_created:string,
    date_updated:string|null
}

export interface FunnelOptions{
    page:number|null,
    pageSize:number|null,
    query:string|null
}

export interface FunnelStageOptions{
    page:number|null,
    pageSize:number|null,
    query:string|null
}