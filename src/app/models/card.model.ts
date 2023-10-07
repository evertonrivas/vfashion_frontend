import { FormatType } from "../common/dashboard/card/card.component"

export interface Card {
    dataType:FormatType,
    icon:string|null,
    iconColor:string|null,
    title:string|null,
    subtitle:SubtitleCard|null,
    text:string|null
    value:number|null
}

export interface SubtitleCard{
    prefix:string|number,
    prefixColor:string|null,
    text:string|null,
	show_arrow:boolean
}