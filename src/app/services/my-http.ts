import { isDevMode } from "@angular/core";
import { HttpClient, HttpHandler, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment as sys_config } from "src/environments/environment";
import { environment as sys_config_dev } from "src/environments/environment.development";
import { Options } from "../models/paginate.model";

export enum ContentType {
    text = 0,
    json = 1,
    form = 2,
    none = 3
}

export class MyHttp {
    sys_config = isDevMode()?sys_config_dev:sys_config;
    constructor(protected http:HttpClient){

    }

    protected getHeader(cType:ContentType = ContentType.none):HttpHeaders{
        let content_type = '';
        switch (cType){
            case ContentType.json:{
                content_type = 'application/json'; break;
            }
            case ContentType.text:{
                content_type = 'text/plain'; break;
            }
            case ContentType.form:{
                content_type = 'multipart/form-data';break;
            }
            case ContentType.none:{
                content_type = 'application/octet-stream'; break;
            }
        }
        let header = new HttpHeaders()
        .set("Authorization",localStorage.getItem('token_type')+' '+localStorage.getItem('token_access'));
        if (content_type!=''){
            header = header.set('Content-Type',content_type);
        }
        return header;
    }

    protected getParams(opt:Options):HttpParams{
        return new HttpParams().set("page",opt.page).set("pageSize",opt.pageSize).set("query",opt.query);
    }
}
