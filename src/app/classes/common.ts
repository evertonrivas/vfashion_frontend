import { Subscription } from "rxjs";
import { Checkbox } from "../models/checkbox.model";
import { Options, RequestResponse } from "../models/paginate.model";
import { AccessLevel, FileType, ModuleName } from "../models/system.enum";
import { Router } from "@angular/router";
import { MenuItem } from "primeng/api/menuitem";
import * as sys_config from 'src/assets/config.json';
import { Field } from "../models/field.model";

export class Common{
    filterVisible:boolean = false;
    filters:Field[] = [];
    sysconfig = ((sys_config as any).default);
    module:ModuleName = ModuleName.NONE;
    modulePath:string = "";
    modules = ModuleName;
    response:RequestResponse;
    options:Options = {
        page: 1,
        pageSize: this.sysconfig.system.pageSize,
        query:''
    };
    masterChecked:boolean = false;
    hasSended:boolean = false;
    hasSendDelete:boolean = false;
    isEdit:boolean = false;
    registryChecked:Checkbox = {};
    serviceSub:Subscription[] = [];
    isCollapsedMassive:boolean = false;
    isCollapsedFilter:boolean = false;
    offcanvas:any;
    modal:any;
    totalChecked:number = 0;
    message:string = "";
    searchTerm:string = "";
    loading:boolean = false;
    showDialog:boolean = false;
    level_access!:AccessLevel;
    levels = AccessLevel;
    tableSelected:any[] = [];

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

        for(let i=0;i<10;i++){
            if (this.serviceSub[i]==undefined)
                this.serviceSub.push(new Subscription);
        }

        this.getModule();
        switch(localStorage.getItem("level_access") as string){
            case 'A': this.level_access = AccessLevel.ADMIN; break;
            case 'L': this.level_access = AccessLevel.STORE; break;
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
        }else if(url_parts[0]=="return"){
            this.module = ModuleName.FPR;
        }else if(url_parts[0]=="salesforce"){
            this.module = ModuleName.B2B;
        }

        this.modulePath = "/"+url_parts[0];
    }

    getMonthName(month:number):string{
        let dt = new Date()
        dt.setMonth(month-1);
        return dt.toLocaleString([],{ month:'short' }).replace(".","");
    }

    paginate(page:number){
        this.options.page = page;
    }

    setPaginationSize(size:number):void{
        this.options.pageSize = size;
    }

    checkUncheckAll():void{
        Object.keys(this.registryChecked).forEach((v) =>{
          this.registryChecked[Number(v)] = this.masterChecked;
        });
    }

    collapseMassive():void{
        this.isCollapsedMassive = !this.isCollapsedMassive;
        let el:HTMLElement|null = document.getElementById("massiveFilterPanel");
        if(el!=null){
            if(el.className=="collapse show"){
                this.isCollapsedFilter = false;
            }
        }
    }

    collapseFilter():void{
        this.isCollapsedFilter = !this.isCollapsedFilter;
        let el:HTMLElement|null = document.getElementById("massiveFilterPanel");
        if(el!=null){
            if(el.className=="collapse show"){
                this.isCollapsedMassive = false;
            }
        }
    }

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
        console.log(this.filterVisible);
        this.filterVisible = true;
    }
}
