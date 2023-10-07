export enum ModuleName{
    ADM = 0,
    CRM = 1,
    B2B = 2,
    SCM = 3,
    FPR = 4,
    FCM = 5, //prefer futuro modulo financeiro
    NONE = -1
  }

export enum ActionToPaginate{
    TO   = 0,
    NEXT = 1,
    PREV = 2
}

export enum EntityType{
    C = "C",
    R = "R",
    S = "S"
}

export enum FileType {
    JSON = 0,
    CSV  = 1,
    STR  = 2
}

export enum DataOrder{
    NONE      = -1,
    ALFA_ASC  = 0,
    ALFA_DESC = 1,
    QTD_ASC   = 2,
    QTD_DESC  = 3,
    NUM_ASC   = 4,
    NUM_DESC  = 5
}

export enum DataSearch{
    CONTAINS   = 0,
    START_WITH = 1,
    ENDS_WITH  = 2,
    EXACT      = 3
}

export enum CustomerAction{
    
}