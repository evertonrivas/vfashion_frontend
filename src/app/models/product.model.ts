import { Paginate } from "./paginate.model"

export interface Image{
    id:number,
    img_url:string
}

export interface Product {
    id: number,
    id_category: number,
    prodCode:string,
    barCode:string|null,
    refCode:string,
    name:string,
    description:string|null,
    observation:string|null,
    ncm:string|null,
    price: string,
    measure_unit:string,
    structure:string,
    date_created:string,
    date_updated:string|null,
    images: Image[]
}

export interface B2bBrand{
    id: number,
    name: string|null,
    date_created: string,
    date_updated: string|null
}

export interface ProductCollection{
    id: number,
    name: string,
    table_prices: string[]|null
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
    size_name:string,
    size:string
}

export interface Color{
    id: number,
    hexcode:string,
    name:string,
    color:string
}

export interface ProductStockSizes{
    size_code: string,
    size_name: string,
    size_value: number
}

export interface ProductStock{
    color_name: string,
    color_hexa: string,
    color_code:string,
    sizes : ProductStockSizes[]
}

export interface Grid{
    [key:number]: {
        [key:string]:{
            [key:string]: number
        }
    }
}

export interface SubTotal{
    [key:number]: {
        [key:string]:number
    }
}