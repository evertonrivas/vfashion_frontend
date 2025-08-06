export enum ModuleName{
    ADM = 0,
    CRM = 1,
    B2B = 2,
    SCM = 3,
    FPR = 4,
    FCM = 5, // futuro modulo financeiro
    MPG = 6, // futuro modulo de marketing
    ORD = 7, // simboliza o modulo do representante, mas eh gestao de pedidos
    NONE = -1
  }

export enum ActionToPaginate{
    TO   = 0,
    NEXT = 1,
    PREV = 2
}

export enum EntityType{
    C = "C", //Customer
    R = "R", //Representative
    S = "S"  //Supplier
}

export enum FileType {
    JSON = 0,
    CSV  = 1,
    STR  = 2
}

export enum FieldType{
    HIDDEN  = 0,
    INPUT   = 1,
    DATE    = 2,
    PERIOD  = 3,
    RADIO   = 4,
    CHECK   = 5,
    COMBO   = 6,
    NUMBER  = 7,
    MCOMBO  = 8,
    TEXT    = 9,
    COLOR   = 10,
    KCOLOR  = 11,
    PASSWD  = 12,
    BARCODE = 13,
    MONEY   = 14,
    URL     = 15,
    IMGURL  = 16,
    ICON    = 17,
    TAXVAT  = 18,
    POSTAL_CODE = 19
}

export enum FieldCase{
    UPPER  = 0,
    LOWER  = 1,
    NONE   = 2
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


export enum DevolutionStatus{
    SAVED         = 0, //help
    PENDING       = 1, //warning
    APPROVED_ALL  = 2, //primary
    APPROVED_PART = 3, //success
    REJECTED      = 4,  //error
    FINISHED      = 5
}

export enum OrderStatus {
    DRAFT        = -1, //Digitado
    ANALIZING    = 0, //Em Análise
    SENDED       = 1, //Enviado
    PROCESSING   = 2, //Processando
    TRANSPORTING = 3, //Em Transporte
    FINISHED     = 4, //Finalizado
    REJECTED     = 5 //Rejeitado
}

export enum CustomerAction{
    
}

export enum CustomerCurve{
    FIVE_STARS  = 5,
    FOUR_STARS  = 4,
    THREE_STARS = 3,
    TWO_STARS   = 2,
    ONE_STAR    = 1
}

export enum AccessLevel{
    ADMIN  = 'A', //administrador
    STORE  = 'L', //lojista
    ISTORE = 'I', //lojista (ia)
    REPR   = 'R', //representante
    SALES  = 'V', //vendedor
    USER   = 'C', //company user
    NONE   = ''
}
//A = Administrador, L = Lojista, R = Representante, V = Vendedor, C = Company User

export enum CrmConfigKeys{
    DEFAULT_FUNNEL_STAGES = 'DEFAULT_FUNNEL_STAGES'
}

export enum MassiveProductAction{
    CATEGORY = 1,
    GRID     = 2,
    MODEL    = 3,
    PRICE    = 4,
    TYPE     = 5,
    MEASURE  = 6
}

export interface FilePdf{
    "name":string,
    "type":string,
    "size":number,
    "content":string
}

export interface F2bReport{
    "id": number,
    "name":string,
    "filters": string[]
}

export enum ReportsCategory{
    CUSTOMER   = 1,
    CALENDAR   = 2,
    CRM        = 3,
    DEVOLUTION = 4,
    ORDER      = 5
}