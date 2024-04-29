import { Paginate } from "./paginate.model"

export interface Image{
    id:number,
    img_url:string,
    default:boolean
}

export interface Color{
    id:number,
    name:string,
    color:string
}

export interface Product {
    id: number,
    id_type:number,
    id_model:number,
    id_grid:number,
    prodCode:string,
    barCode:string|null,
    refCode:string,
    name:string,
    description:string|null,
    observation:string|null,
    ncm:string|null,
    price: number,
    id_measure_unit:number,
    structure:string,
    date_created:string,
    date_updated:string|null,
    images: Image[],
    colors:Color[],
    checked:boolean
}

export interface B2bBrand{
    id: number,
    name: string|null,
    id_brand:number,
    brand:string|null,
    date_created: string,
    date_updated: string|null
}

export interface ProductCollection{
    id: number,
    name: string,
    brand: B2bBrand|undefined,
    table_prices:any[]|undefined
}

export interface ProductCategory{
    id: number,
    name: string|null,
    id_parent: number|null,
    date_created: string,
    date_updated: string|null
}

export interface ProductType{
    id:number,
    name:string
}

export interface ProductModel{
    id: number,
    name: string
}

export interface Size{
    id: number,
    new_size:string,
    old_size:string,
    name:string
}

export interface Color{
    id: number,
    hexcode:string,
    name:string,
    color:string
}

export interface ProductStockSizes{
    size_id   : number,
    size_code : string,
    size_name : string,
    size_value: number,
    size_saved: number
}

export interface ProductStock{
    color_id  : number,
    color_name: string,
    color_hexa: string,
    color_code:string,
    sizes : ProductStockSizes[]
}

export interface ProductGrid{
    id:number,
    origin_id:number,
    name:string,
    default:boolean,
    distribution: ProductGridDistribution[]
    date_created:string,
    date_updated:string|null
}

export interface ProductGridDistribution{
    id_color:number,
    color:string,
    sizes:ProductGridDistributionSize[]
}

export interface ProductGridDistributionSize{
    id_size:number,
    size:string,
    value:number
}

export interface SubTotal{
    [key:number]: {
        [key:string]:number
    }
}