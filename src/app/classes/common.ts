import { Subscription } from "rxjs";
import { isDevMode } from "@angular/core";
import { Options, RequestResponse } from "../models/paginate.model";
import { AccessLevel, FileType, ModuleName } from "../models/system.enum";
import { Router } from "@angular/router";
import { environment as sys_config } from "src/environments/environment";
import { environment as sys_config_dev } from "src/environments/environment.development";
import { FieldFilter, FormRow } from "../models/field.model";
import { SysConfig } from "../models/auth.model";

export class Common{
    filterVisible:boolean = false; //exibe ou nao os filtros do admin
    filters:FieldFilter[] = []; //campo de configuracao dos filtros
    formRows:FormRow[] = []; //campos do formulario de cadastro
    idToEdit:number = 0;//id do registro que esta em edicao no form
    formVisible:boolean = false; //exibe ou oculta o formulario
    envconfig = isDevMode()?sys_config_dev:sys_config; //arquivo de configuracoes do sistema
    sysconfig:SysConfig = {
        use_company_custom: false,
        company_name: "",
        company_logo: "",
        company_instagram: "",
        company_facebook: "",
        company_linkedin: "",
        company_max_up_files: 0,
        company_max_up_images: 0,
        company_use_url_images: false,
        system_pagination_size: 0,
        flimv_model: "",
        company_dashboard_color: "",
        company_dashboard_image: ""
    }
    module:ModuleName = ModuleName.NONE; // nome do module que estah em uso no sistema
    modulePath:string = ""; //url do caminho do modulo
    modules = ModuleName; //lista de modulos existentes
    response:RequestResponse; //resposta padrao para os servicos
    disabledNew:boolean = false; //habilita ou desabilita a edicao ou novo registro no admin
    options:Options = {
        page: 1,
        pageSize: 0,
        query:''
    }; //opcoes padrao para buscas no sistema
    hasSended:boolean = false;//serve para validacao de campos quando ha envio
    hasSendDelete:boolean = false;//serve para validacao de campos quando ha exclusao
    hasSendMassive:boolean = false; //serve para validacao de campos em acoes massivas
    serviceSub:Subscription[] = []; //armazena o retorno das subscriptions do sistema
    level_access!:AccessLevel; //nivel de acesso do usuario ao sistema
    levels = AccessLevel; //niveis de acesso existentes
    loading:boolean = false; //carregando, utilizado em varios pontos do sistema
    showDialog:boolean = false; //flag de exibicao de dialogs pelo sistema
    tableSelected:any[] = []; //selecao de checkbox em tabelas do sistema
    isTrash:boolean = false; //indica se esta na visualizacao de lixeira ou nao

    constructor(protected route:Router){
        this.response = {
            pagination : {
                page : 0,
                has_next : false,
                pages : 0,
                per_page : 0,
                registers: 0
            },
            data : undefined
        }

        this.sysconfig = {
            use_company_custom: JSON.stringify(localStorage.getItem("use_company_custom")).replaceAll('"',"")=="1"?true:false,
            company_name: JSON.stringify(localStorage.getItem("company_name")).replaceAll('"',""),
            company_logo: JSON.stringify(localStorage.getItem("company_logo")).replaceAll('"',""),
            company_instagram: JSON.stringify(localStorage.getItem("company_instagram")).replaceAll('"',""),
            company_facebook: JSON.stringify(localStorage.getItem("company_facebook")).replaceAll('"',""),
            company_linkedin: JSON.stringify(localStorage.getItem("company_linkedin")).replaceAll('"',""),
            company_max_up_files: parseInt(JSON.stringify(localStorage.getItem("company_max_up_files")).replaceAll('"',"")),
            company_max_up_images: parseInt(JSON.stringify(localStorage.getItem("company_max_up_images")).replaceAll('"',"")),
            company_use_url_images: JSON.stringify(localStorage.getItem("company_use_url_images")).replaceAll('"',"")=="1"?true:false,
            system_pagination_size: parseInt(JSON.stringify(localStorage.getItem("system_pagination_size")).replaceAll('"',"")),
            flimv_model: JSON.stringify(localStorage.getItem("flimv_model")).replaceAll('"',''),
            company_dashboard_color: JSON.stringify(localStorage.getItem("company_dashboard_color")).replaceAll('"',''),
            company_dashboard_image: JSON.stringify(localStorage.getItem("company_dashboard_image")).replaceAll('"','')
        }
        this.options.pageSize = this.sysconfig.system_pagination_size;

        for(let i=0;i<10;i++){
            if (this.serviceSub[i]==undefined)
                this.serviceSub.push(new Subscription);
        }

        this.getModule();
        switch(localStorage.getItem("level_access") as string){
            case 'A': this.level_access = AccessLevel.ADMIN; break;
            case 'L': this.level_access = AccessLevel.STORE; break;
            case 'I': this.level_access = AccessLevel.ISTORE; break;
            case 'R': this.level_access = AccessLevel.REPR; break;
            case 'V': this.level_access = AccessLevel.SALES; break;
            case 'C': this.level_access = AccessLevel.USER; break; 
        }
    }

    getModule():void{
        let url_parts = this.route.url.substring(1,this.route.url.length).split("/");

        if(url_parts[0]=="calendar"){
            this.module = ModuleName.SCM;
        }else if(url_parts[0]=="admin"){
            this.module = ModuleName.ADM;
        }else if(url_parts[0]=="crm"){
            this.module = ModuleName.CRM;
        }else if(url_parts[0]=="devolution"){
            this.module = ModuleName.FPR;
        }else if(url_parts[0]=="salesforce"){
            this.module = ModuleName.B2B;
        }else if(url_parts[0]=="orders"){
            this.module = ModuleName.ORD;
        }

        this.modulePath = "/"+url_parts[0];
    }

    getMonthName(month:number):string{
        let dt = new Date()
        dt.setMonth(month-1);
        return dt.toLocaleString([],{ month:'short' }).replace(".","");
    }

    // paginate(page:number){
    //     this.options.page = page;
    // }

    // setPaginationSize(size:number):void{
    //     this.options.pageSize = size;
    // }

    // checkUncheckAll():void{
    //     Object.keys(this.registryChecked).forEach((v) =>{
    //       this.registryChecked[Number(v)] = this.masterChecked;
    //     });
    // }

    // collapseMassive():void{
    //     this.isCollapsedMassive = !this.isCollapsedMassive;
    //     let el:HTMLElement|null = document.getElementById("massiveFilterPanel");
    //     if(el!=null){
    //         if(el.className=="collapse show"){
    //             this.isCollapsedFilter = false;
    //         }
    //     }
    // }

    // collapseFilter():void{
    //     this.isCollapsedFilter = !this.isCollapsedFilter;
    //     let el:HTMLElement|null = document.getElementById("massiveFilterPanel");
    //     if(el!=null){
    //         if(el.className=="collapse show"){
    //             this.isCollapsedMassive = false;
    //         }
    //     }
    // }

    /**
     * 
     * @param data 
     * @param type J = JSON, C = JSON to CSV, S = String IN CSV Format
     */
    exportFile(data:any, type:FileType = FileType.JSON):void{
        const link = document.createElement("a");

        // if (type==FileType.CSV){
        //     const string = JSON.stringify(data);
        //     const json = JSON.parse(string);
        //     const csvString = Papa.unparse(json,{delimiter:';'});
        //     const blob = new Blob([csvString],{type: 'application/csv;charset=utf-8'});
        //     const url = URL.createObjectURL(blob);
            
        //     link.href  = url;
        //     link.download = "data.csv";
        // }
        // else 
        if(type==FileType.JSON){
            let theJSON = JSON.stringify(data);
            const blob = new Blob([theJSON],{type: 'application/json;charset=utf-8'});
            const url = URL.createObjectURL(blob);

            link.href = url;
            link.download = 'data.json';
        }else if(type==FileType.STR){
            const blob = new Blob([data],{type: 'application/csv;charset=utf-8'});
            const url = URL.createObjectURL(blob);

            link.href = url;
            link.download = "data.csv";
        }

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
    }

    get monthNames():string[]{
        return ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
    }

    getShortMonthNames():string[]{
        return ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ']
    }

    showFilter():void{
        this.filterVisible = true;
    }

    isDesktop() {
        return window.innerWidth > 991;
    }
    
    isMobile(){
    return !this.isDesktop();
    }
}
