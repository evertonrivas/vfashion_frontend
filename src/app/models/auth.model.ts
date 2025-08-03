export interface Auth {
    token_access: string,
    token_type: string,
    token_expire: string,

    id_user:number,
    id_profile: number,
    level_access: string,
    config: SysConfig
}


export interface SysConfig{
    company_dashboard_color:string,
    company_dashboard_image:string,
    company_facebook:string,
    company_instagram:string,
    company_linkedin:string,
    company_logo:string,
    company_max_up_files:number,
    company_max_up_images:number,
    company_name:string,
    company_use_url_images:boolean,
    flimv_model:string,
    system_pagination_size:number,
    use_company_custom:boolean,
}