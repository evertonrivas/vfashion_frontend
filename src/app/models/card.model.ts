export enum FormatType{
    MONEY   = 1,
    NUMBER  = 2,
    TEXT    = 3,
    HTML    = 4,
    PERCENT = 5
  }

export interface Card {
    dataType:FormatType,
    icon:string|null,
    iconColor:string|null,
    title:string|null,
    subtitle:SubtitleCard|null,
    text:string|null
    value:number
    disabled:boolean
}

export interface SubtitleCard{
    prefix:string|number|undefined,
    prefixColor:string|undefined,
    text:string|undefined,
	show_arrow:boolean
    dataType:FormatType
}