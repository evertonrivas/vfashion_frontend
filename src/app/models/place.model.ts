export interface Country {
    id:number,
    name:string
}

export interface StageRegion{
    id:number,
    country:Country,
    name:string,
    acronym:string
}

export interface City{
    id:number,
    state_region:StageRegion,
    name:string,
    brazil_ibge_code:string|null
}