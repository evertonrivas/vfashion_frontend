import { HttpClient, HttpHandler, HttpHeaders, HttpParams } from "@angular/common/http";
import * as configData from 'src/assets/config.json';

export enum ContentType {
    text = 0,
    json = 1,
    form = 2,
    none = 3
}

export class MyHttp {
    sys_config:any = (configData as any).default;
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
}
