import { FieldType } from "./system.enum";

export interface FieldOption{
    option: any,
    value: string
}

export interface FieldFilter {
    label:string,
    name:string,
    placeholder:string|undefined,
    type: FieldType,
    value: any|undefined,
    options: FieldOption[]|undefined,
    filter_name: string,
    filter_prefix: string
}

export interface FormField {
    label:string,
    name:string,
    placeholder:string|undefined,
    type: FieldType,
    value: any|undefined,
    options:FieldOption[]|undefined,
    required:boolean
}

export interface FormRow{
    fields:FormField[]
}