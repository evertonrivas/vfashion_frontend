import { Collection } from "./collection.model"

export interface Months{
    position: number,
    weeks: number[]
}

export interface CalendarModel{
    year: number,
    months: Months[]
}

export interface CalendarEventType{
    id: number,
    name:string | null,
    hex_color:string,
    has_budget:boolean,
    use_collection:boolean,
    is_milestone:boolean,
    children: CalendarEventType[],
    parent: CalendarEventType[]
}

export interface CalendarEvent{
    id:number,
    id_parent: number |null,
    name:string,
    start_week:number,
    end_week:number,
    start_date:string,
    end_date:string,
    type: CalendarEventType,
    year:number,
    budget_value:number | null,
    collection: Collection,
    children: CalendarEvent[]
    date_created:string|null,
    date_updated:string|null
}

export interface CalendarEventData{
    id:number,
    id_parent:number|null,
    name:string,
    date_start:string,
    date_end:string,
    id_event_type: number,
    id_collection:number | null,
    budget_value:number | null,
    year:number
}