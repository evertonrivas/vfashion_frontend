import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Common } from 'src/app/classes/common';
import { SharedModule } from 'src/app/common/shared.module';
import { EntitiesService } from 'src/app/services/entities.service';
import { SliderModule } from 'primeng/slider';
import { Entity } from 'src/app/models/entity.model';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { ComissionService } from 'src/app/services/comission.service';
import { ResponseError } from 'src/app/models/paginate.model';

export interface f2bComission{
  [index:number]:number
}

export interface f2bTarget{
  [index:number]:number
}

@Component({
  selector: 'app-rep-comission',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    SliderModule
  ],
  templateUrl: './rep-comission.component.html',
  styleUrl: './rep-comission.component.scss',
  providers:[MessageService, ConfirmationService]
})
export class RepComissionComponent extends Common implements AfterViewInit{
  comissionYear?:Date;
  comissionValue:f2bComission = {};
  all_commission:number = 0;
  selected_target:string = "";
  disabled_target:boolean = false;
  months:string[] = [];
  quarters:string[] = [];

  targetYear?:Date;
  targetValueYear:number = 0;
  targetValueQuarter:f2bTarget = {};
  targetValueMonth:f2bTarget = {};
  targetMaxValue:number = 0;
  constructor(route:Router,
    private svc:ComissionService,
    private svcE:EntitiesService,
    private msg:MessageService,
    private cnf:ConfirmationService
  ){
    super(route);
    this.months.push("Janeiro");
    this.months.push("Fevereiro");
    this.months.push("Março");
    this.months.push("Abril");
    this.months.push("Maio");
    this.months.push("Junho");
    this.months.push("Julho");
    this.months.push("Agosto");
    this.months.push("Setembro");
    this.months.push("Outubro");
    this.months.push("Novembro");
    this.months.push("Dezembro");

    this.quarters.push("Q1");
    this.quarters.push("Q2");
    this.quarters.push("Q3");
    this.quarters.push("Q4");
  }
  
  ngAfterViewInit(): void {

    //busca todos os representantes existentes
    this.svcE.listEntity({page:1,pageSize:1,query:'can:list-all 1||is:order-by fantasy_name||is:type R'}).subscribe({
      next: (data) =>{
        this.response.data = data;
        (this.response.data as Entity[]).forEach(e =>{
          if(this.comissionValue[e.id]==undefined){
            this.comissionValue[e.id] = 0;
          }
        });
      }
    });

    //monta o ponto de entrada mensal das metas
    for(let i=0;i<12;i++){
      if(this.targetValueMonth[i]==undefined){
        this.targetValueMonth[i] = 0;
      }
    }

    //monta o pronto de entrada trimestral das metas
    for (let i=0;i<4;i++){
      if(this.targetValueQuarter[i]==undefined){
        this.targetValueQuarter[i] = 0;
      }
    }

    //busca a meta do ano
    this.onLoadTarget();

    //busca a comissao do ano
    this.onLoadComission();
  }

  onCheckOption(evt:DropdownChangeEvent){
    Object.keys(this.targetValueMonth).forEach(k =>{
      this.targetValueMonth[parseInt(k)] = 0;
    });
    Object.keys(this.targetValueQuarter).forEach(k =>{
      this.targetValueQuarter[parseInt(k)] = 0;
    });
    this.targetValueYear = 0;
  }

  onLoadTarget():void{
    let year = (this.targetYear==null)? (new Date()).getFullYear() :this.targetYear?.getFullYear();
    this.svc.loadTarget(year).subscribe({
      next: (data) =>{
        if(data == null){
          this.targetYear = new Date(); 
        }
        this.targetYear = new Date(data.year,0,1);
        this.selected_target       = data.type;
        this.targetMaxValue        = parseFloat(data.max_value);
        this.targetValueYear       = parseFloat(data.value_year);
        this.targetValueQuarter[0] = parseFloat(data.value_quarter1);
        this.targetValueQuarter[1] = parseFloat(data.value_quarter2);
        this.targetValueQuarter[2] = parseFloat(data.value_quarter3);
        this.targetValueQuarter[3] = parseFloat(data.value_quarter4);
        this.targetValueMonth[0]   = parseFloat(data.value_jan);
        this.targetValueMonth[1]   = parseFloat(data.value_feb);
        this.targetValueMonth[2]   = parseFloat(data.value_mar);
        this.targetValueMonth[3]   = parseFloat(data.value_apr);
        this.targetValueMonth[4]   = parseFloat(data.value_may);
        this.targetValueMonth[5]   = parseFloat(data.value_jun);
        this.targetValueMonth[6]   = parseFloat(data.value_jul);
        this.targetValueMonth[7]   = parseFloat(data.value_aug);
        this.targetValueMonth[8]   = parseFloat(data.value_sep);
        this.targetValueMonth[9]   = parseFloat(data.value_oct);
        this.targetValueMonth[10]  = parseFloat(data.value_nov);
        this.targetValueMonth[11]  = parseFloat(data.value_dec);
      }
    })
  }

  onLoadComission(){
    let year = (this.comissionYear==null)? (new Date()).getFullYear() :this.comissionYear?.getFullYear();
    this.svc.loadComission(year).subscribe({
      next:(data) =>{
        //this.targetYear = new Date(data.year,0,1);
        this.comissionYear = new Date(data.year,0,1);
        data.comission.forEach((d: { id: number, id_representative: number; percent: number; value:number }) =>{
          this.comissionValue[d.id_representative] = d.percent;
        });
      }
    });
  }

  recalcAll():void{
    (this.response.data as Entity[]).forEach(e =>{
      this.comissionValue[e.id] = this.all_commission;
    })
  }

  onSaveTarget():void{
    this.hasSended = true;

    if(this.targetYear==null || this.targetYear==undefined){
      return;
    }

    if(this.selected_target=='Y'){
      if (this.targetValueYear==0){
        return;
      }
    }

    if(this.selected_target=='Q'){
      Object.keys(this.targetValueQuarter).forEach(k =>{
        if (this.targetValueQuarter[parseInt(k)]==0){
          return;
        }
      });
    }

    if(this.selected_target=='M'){
      Object.keys(this.targetValueMonth).forEach(k =>{
        if (this.targetValueMonth[parseInt(k)]==0){
          return;
        }
      });
    }

    let save:any = {
      type: this.selected_target,
      max_value: this.targetMaxValue,
      value_year: this.targetValueYear,
      value_quarter1: this.targetValueQuarter[0],
      value_quarter2: this.targetValueQuarter[1],
      value_quarter3: this.targetValueQuarter[2],
      value_quarter4: this.targetValueQuarter[3],
      value_jan: this.targetValueMonth[0],
      value_feb: this.targetValueMonth[1],
      value_mar: this.targetValueMonth[2],
      value_apr: this.targetValueMonth[3],
      value_may: this.targetValueMonth[4],
      value_jun: this.targetValueMonth[5],
      value_jul: this.targetValueMonth[6],
      value_aug: this.targetValueMonth[7],
      value_sep: this.targetValueMonth[8],
      value_oct: this.targetValueMonth[9],
      value_nov: this.targetValueMonth[10],
      value_dec: this.targetValueMonth[11]
    };

    this.svc.saveTarget(this.targetYear.getFullYear(),save).subscribe({
      next: (data) =>{
        this.msg.clear();
        this.hasSended = false;
        if (typeof data === 'boolean'){
          this.msg.add({
            key:'systemToast',
            severity: 'success',
            summary:'Sucesso!',
            detail: 'Meta(s) definida(s) com sucesso.'
          });
        }else{
          this.msg.add({
            key:'systemToast',
            severity:'error',
            summary:'Falha!',
            detail: 'Ocorreu o seguinte erro: '+(data as ResponseError).error_details
          });
        }
      }
    });
  }

  onSaveComission():void{
    this.hasSended = true;
    let send:any[] = [];
    (this.response.data as Entity[]).forEach(e =>{
      send.push({
        id_representative: e.id,
        year: this.comissionYear?.getFullYear(),
        percent: this.comissionValue[e.id],
        value: undefined
      });
    });

    if(this.comissionYear==null || this.comissionYear==undefined){
      return;
    }

    this.svc.saveComission(this.comissionYear.getFullYear(),send).subscribe({
      next: (data) =>{
        this.msg.clear();
        if (typeof data ==='boolean'){
          this.msg.add({
            key:'systemToast',
            severity: 'success',
            summary:'Sucesso!',
            detail: 'Comissões definidas com sucesso.'
          });
        }else{
          this.msg.add({
            key:'systemToast',
            severity:'error',
            summary:'Falha!',
            detail: 'Ocorreu o seguinte erro: '+(data as ResponseError).error_details
          });
        }
      }
    })
  }
}
