export interface Auth {
    token_access: string,
    token_type: string,
    token_expire: string,

    id_user:number,
    id_profile: number,
    level_access: string,
}


export interface SysConfig{
    use_company_custom:boolean,
    company_name:string,
    company_logo:string,
    company_instagram:string,
    company_facebook:string,
    company_linkedin:string,
    company_max_up_files:number,
    company_max_up_images:number,
    company_use_url_images:boolean,
    system_pagination_size:number
}