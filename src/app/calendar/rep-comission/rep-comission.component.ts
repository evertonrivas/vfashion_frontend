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
  yearComission?:Date;
  valueComission:f2bComission = {};
  all_commission:number = 0;
  selected_target:string = "";
  disabled_target:boolean = false;
  months:string[] = [];
  quarters:string[] = [];
  yearTarget?:Date;
  valueTargetYear:number = 0;
  valueTargetQuarter:f2bTarget = {};
  valueTargetMonth:f2bTarget = {};
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
          if(this.valueComission[e.id]==undefined){
            this.valueComission[e.id] = 0;
          }
        });
      }
    });

    //monta o ponto de entrada mensal das metas
    for(let i=0;i<12;i++){
      if(this.valueTargetMonth[i]==undefined){
        this.valueTargetMonth[i] = 0;
      }
    }

    //monta o pronto de entrada trimestral das metas
    for (let i=0;i<4;i++){
      if(this.valueTargetQuarter[i]==undefined){
        this.valueTargetQuarter[i] = 0;
      }
    }

    //busca a meta do ano
    this.onLoadTarget();

    //busca a comissao do ano
    this.onLoadComission();
  }

  onCheckOption(evt:DropdownChangeEvent){
    Object.keys(this.valueTargetMonth).forEach(k =>{
      this.valueTargetMonth[parseInt(k)] = 0;
    });
    Object.keys(this.valueTargetQuarter).forEach(k =>{
      this.valueTargetQuarter[parseInt(k)] = 0;
    });
    this.valueTargetYear = 0;
  }

  onLoadTarget():void{
    let year = (this.yearTarget==null)? (new Date()).getFullYear() :this.yearTarget?.getFullYear();
    this.svc.loadTarget(year).subscribe({
      next: (data) =>{
        this.yearTarget = new Date(data.year,0,1);
        this.selected_target       = data.type;
        this.valueTargetYear       = parseFloat(data.value_year);
        this.valueTargetQuarter[0] = parseFloat(data.value_quarter1);
        this.valueTargetQuarter[1] = parseFloat(data.value_quarter2);
        this.valueTargetQuarter[2] = parseFloat(data.value_quarter3);
        this.valueTargetQuarter[3] = parseFloat(data.value_quarter4);
        this.valueTargetMonth[0]   = parseFloat(data.value_jan);
        this.valueTargetMonth[1]   = parseFloat(data.value_feb);
        this.valueTargetMonth[2]   = parseFloat(data.value_mar);
        this.valueTargetMonth[3]   = parseFloat(data.value_apr);
        this.valueTargetMonth[4]   = parseFloat(data.value_may);
        this.valueTargetMonth[5]   = parseFloat(data.value_jun);
        this.valueTargetMonth[6]   = parseFloat(data.value_jul);
        this.valueTargetMonth[7]   = parseFloat(data.value_aug);
        this.valueTargetMonth[8]   = parseFloat(data.value_sep);
        this.valueTargetMonth[9]   = parseFloat(data.value_oct);
        this.valueTargetMonth[10]  = parseFloat(data.value_nov);
        this.valueTargetMonth[11]  = parseFloat(data.value_dec);
      }
    })
  }

  onLoadComission(){
    let year = (this.yearComission==null)? (new Date()).getFullYear() :this.yearComission?.getFullYear();
    this.svc.loadComission(year).subscribe({
      next:(data) =>{
        //this.yearTarget = new Date(data.year,0,1);
        this.yearComission = new Date(data.year,0,1);
        data.comission.forEach((d: { id: number, id_representative: number; percent: number; value:number }) =>{
          this.valueComission[d.id_representative] = d.percent;
        });
      }
    });
  }

  recalcAll():void{
    (this.response.data as Entity[]).forEach(e =>{
      this.valueComission[e.id] = this.all_commission;
    })
  }

  onSaveTarget():void{
    this.hasSended = true;

    if(this.yearTarget==null || this.yearTarget==undefined){
      return;
    }

    if(this.selected_target=='Y'){
      if (this.valueTargetYear==0){
        return;
      }
    }

    if(this.selected_target=='Q'){
      Object.keys(this.valueTargetQuarter).forEach(k =>{
        if (this.valueTargetQuarter[parseInt(k)]==0){
          return;
        }
      });
    }

    if(this.selected_target=='M'){
      Object.keys(this.valueTargetMonth).forEach(k =>{
        if (this.valueTargetMonth[parseInt(k)]==0){
          return;
        }
      });
    }

    let save:any = {
      type: this.selected_target,
      value_year: this.valueTargetYear,
      value_quarter1: this.valueTargetQuarter[0],
      value_quarter2: this.valueTargetQuarter[1],
      value_quarter3: this.valueTargetQuarter[2],
      value_quarter4: this.valueTargetQuarter[3],
      value_jan: this.valueTargetMonth[0],
      value_feb: this.valueTargetMonth[1],
      value_mar: this.valueTargetMonth[2],
      value_apr: this.valueTargetMonth[3],
      value_may: this.valueTargetMonth[4],
      value_jun: this.valueTargetMonth[5],
      value_jul: this.valueTargetMonth[6],
      value_aug: this.valueTargetMonth[7],
      value_sep: this.valueTargetMonth[8],
      value_oct: this.valueTargetMonth[9],
      value_nov: this.valueTargetMonth[10],
      value_dec: this.valueTargetMonth[11]
    };

    this.svc.saveTarget(this.yearTarget.getFullYear(),save).subscribe({
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
        year: this.yearComission?.getFullYear(),
        percent: this.valueComission[e.id],
        value: undefined
      });
    });

    if(this.yearComission==null || this.yearComission==undefined){
      return;
    }

    this.svc.saveComission(this.yearComission.getFullYear(),send).subscribe({
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
