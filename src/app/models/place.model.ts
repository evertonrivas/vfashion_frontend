export interface Country {
    id:number,
    name:string
}

export interface StateRegion{
    id:number,
    country:Country,
    name:string,
    acronym:string
}

export interface City{
    id:number,
    state_region:StateRegion,
    name:string,
    brazil_ibge_code:string|null
}