import { Component,OnInit,OnDestroy, AfterViewInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { Card } from 'src/app/models/card.model';
import { CardComponent } from './card/card.component';
import { EntityType } from 'src/app/models/entity.model';
import { Router } from '@angular/router';
import { AccessLevel, ModuleName } from 'src/app/models/system.enum';
import { Common } from 'src/app/classes/common';
import { formatCurrency } from '@angular/common';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { NgxEchartsModule, NGX_ECHARTS_CONFIG } from 'ngx-echarts';
import { CardModule } from 'primeng/card';
import { FormatType } from 'src/app/models/card.model';

import { IndicatorsService } from 'src/app/services/indicators.service';
import { SecurityService } from 'src/app/services/security.service';
import { ComissionService } from 'src/app/services/comission.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers:[
    {
      provide: NGX_ECHARTS_CONFIG,
      useFactory: () => ({ echarts: () => import('echarts') })
    },
  ],
  imports:[
    CardModule,
    CommonModule,
    CardComponent,
    NgxEchartsModule
  ],
  standalone: true
})
export class DashboardComponent extends Common implements AfterViewInit,OnInit,OnDestroy{
  firstChartOption:EChartsOption = {};
  secondChartOption:EChartsOption = {};
  symbols:any[] = [];
  
  //target (meta)
  bodyMax:number = 0;
  targetNeed:boolean = false;
  targetMax:number = 0;
  chartColor:string = '';
  targetName:string = '';

  //valor total em pedidos
  totalOrder:number = 0;
  
  //cards do topo
  topCards:Card[] = [];
  
  constructor(private svcI:IndicatorsService,
    private svcU:SecurityService,
    private svc:ComissionService,
    route:Router){
      super(route)

      this.symbols.push(this.sysconfig.company_dashboard_image);
      this.chartColor = this.sysconfig.company_dashboard_color;
  }
  
  ngOnDestroy(): void {
    this.serviceSub[0].unsubscribe();
  }
  
  ngOnInit(): void {
    this.mountTopCards();
  }

  private mountTopCards():void{
    
    let maxCards:number = (this.module==this.modules.ADM)?6:4;
    
    for(let i=0;i<maxCards;i++){
      let card:Card = {
        value:0,
        dataType: FormatType.TEXT,
        icon:"",
        iconColor:"",
        title:null,
        subtitle:null,
        text:null,
        disabled: false
      }
      this.topCards.push(card);
    }
  }

  private mountSCMdata():void{
    const $valueOrder          = this.svcI.calendarValueOrder();
    const $countOrder          = this.svcI.calendarCountOrder();
    const $countCustomer       = this.svcI.calendarCountEntity(EntityType.C);
    const $countRepresentative = this.svcI.calendarCountEntity(EntityType.R);
    const $salesRepresentative = this.svcI.calendarValueOrderByRepresentative();

    this.serviceSub[0] = forkJoin([$valueOrder,$countOrder,$countCustomer,$countRepresentative,$salesRepresentative]).subscribe(([valueOrder,countOrder,countCustomer,countRep,salesRep])=>{
      this.topCards[0].icon      = "finance_chip";
      this.topCards[0].iconColor = "green"
      this.topCards[0].title     = "Valor em Pedidos";
      this.topCards[0].value     = valueOrder as number;
      this.topCards[0].dataType  = FormatType.MONEY;
      this.totalOrder = valueOrder as number;

      this.topCards[1].icon      = "order_approve";
      this.topCards[1].iconColor = "blue";
      this.topCards[1].title     = "Nº de Pedidos";
      this.topCards[1].value     = countOrder as number;
      this.topCards[1].dataType  = FormatType.NUMBER;

      this.topCards[2].icon      = "store";
      this.topCards[2].iconColor = "purple";
      this.topCards[2].title     = "Nº de Clientes";
      this.topCards[2].value     = countCustomer as number;
      this.topCards[2].dataType  = FormatType.NUMBER;

      this.topCards[3].icon      = "apartment";
      this.topCards[3].iconColor = "orange";
      this.topCards[3].title     = "Nº de Representantes";
      this.topCards[3].value     = countRep as number;
      this.topCards[3].dataType  = FormatType.NUMBER;
    
      //firstChart
      this.firstChartOption = {
        tooltip:{
          trigger: 'axis',
          axisPointer:{
            type: 'shadow'
          },
          valueFormatter: (value) => formatCurrency(parseFloat((value as number).toString()),"pt","R$")
        },
        legend:{},
        grid:{
          left:'3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
          tooltip:{
            formatter: function(params: { value: any; }){
              //console.log(params.value);
            }
          }
        },
        xAxis:{
          type: 'value',
          max: this.targetMax
          //boundaryGap: [0,0.02]
        },
        yAxis:{
          type: 'category',
          data: salesRep.representative
        },
        series:[{
          name: 'Total Vendido',
          type: 'bar',
          data: salesRep.total,
          markLine:{
            data:[{
              name: 'meta', symbol: 'none', xAxis: this.bodyMax,
              label:{
                formatter: (item) => 'Meta '+this.targetName+'\n'+ formatCurrency(parseFloat((item.value as number).toString()),"pt","R$")
              },
              lineStyle:{
                color: '#198754',
                type: 'dotted',
                join: 'round'
              }
            },
            // { 
            //   name: 'supermeta', symbol: 'none', xAxis: 30000, 
            //   label:{
            //     formatter: (item) => 'Super \n'+formatCurrency(parseFloat((item.value as number).toString()),"pt","R$")
            //   },
            //   lineStyle:{
            //     color: '#ffc107',
            //     type: 'dotted',
            //     join: 'round'
            //   }
            // },
          ],
            symbol: 'circle'
          }
        }]
      }


      const meuBodyMax = this.bodyMax;

      //secondChart
      this.secondChartOption = {
        tooltip: {
          valueFormatter: (value) => formatCurrency(parseFloat((value as number).toString()),"pt","R$")
        },
        legend: {
          data:['Total Vendido'],
        },
        xAxis: {
          data: ['Valor'],
          axisTick: { show: false },
          axisLine: { show: false },
          axisLabel: { show: false }
        },
        yAxis: {
          max: this.bodyMax,
          offset: 20,
          splitLine: { show: false },
          axisLabel:{ show: false }
        },
        grid: {
          top: 'center',
          height: 230
        },
        markLine: {
          z: -80
        },
        series: [
          {
            name: 'Total Vendido',
            type: 'pictorialBar',
            symbolClip: true,
            symbolBoundingData: this.bodyMax, //meta
            color:this.chartColor,
            label: {
              show: true,
              position: 'top',
              offset: [0, -20],
              formatter: function (param: any) {
                return ((param.value / meuBodyMax) * 100).toFixed(0) + '%';
              },
              fontSize: 18,
              fontFamily: 'Arial'
            },
            data: [
              {
                value: this.totalOrder, //valor vendido
                symbol: this.symbols[0]
              }
            ],
            markLine: {
              silent: true,
              symbol: 'none',
              lineStyle: {
                opacity: 0.5,
                miterLimit: 0
              },
              data: [
                {
                  type: 'max',
                  label: {
                    show: false
                  }
                }
              ]
            },
            z: 10
          },
          {
            name: 'full',
            type: 'pictorialBar',
            //barWidth: '40%',
            symbolBoundingData: this.bodyMax,
            animationDuration: 0,
            tooltip:{
              show: false
            },
            itemStyle: {
              color: '#ccc'
            },
            data: [
              {
                value: 1,
                symbol: this.symbols[0]
              }
            ]
          }
        ]
      }
    });

  }

  private mountAdminData():void{
    const $totalUsers = this.svcI.licenseCount();
    const $totalAdmin = this.svcI.licenseCount(AccessLevel.ADMIN);
    const $totalRepre = this.svcI.licenseCount(AccessLevel.REPR);
    const $totalLoja  = this.svcI.licenseCount(AccessLevel.STORE);
    const $totalLojaI = this.svcI.licenseCount(AccessLevel.ISTORE);
    const $totalUser  = this.svcI.licenseCount(AccessLevel.USER);

    this.serviceSub[0] = forkJoin([$totalUsers,$totalAdmin,$totalRepre,$totalLoja,$totalLojaI,$totalUser]).subscribe(([totalUsers,totalAdmin,totalRepre,totalLoja,totalLojaI,totalUser])=>{
      this.topCards[0].icon      = "license";
      this.topCards[0].iconColor = "green"
      this.topCards[0].title     = "Total de Licenças";
      this.topCards[0].value     = totalUsers as number;
      this.topCards[0].dataType  = FormatType.NUMBER;
      // this.topCards[0].subtitle  = {
      //   text: "Total lic.: R$ 127,50",
      //   prefix:  undefined,
      //   prefixColor: undefined,
      //   show_arrow: false,
      //   dataType: FormatType.MONEY
      // };

      this.topCards[1].icon      = "shield_person";
      this.topCards[1].iconColor = "blue";
      this.topCards[1].title     = "Lic. Administrador";
      this.topCards[1].value     = totalAdmin as number;
      this.topCards[1].dataType  = FormatType.NUMBER;
      // this.topCards[1].subtitle  = {
      //   text: "Valor/licença: R$ 127,50",
      //   prefix:  undefined,
      //   prefixColor: undefined,
      //   show_arrow: false,
      //   dataType: FormatType.MONEY
      // };

      this.topCards[2].icon      = "account_circle";
      this.topCards[2].iconColor = "purple";
      this.topCards[2].title     = "Lic. Representante";
      this.topCards[2].value     = totalRepre as number;
      this.topCards[2].dataType  = FormatType.NUMBER;
      // this.topCards[2].subtitle  = {
      //   text: "Valor/licença: R$ 75,50",
      //   prefix:  undefined,
      //   prefixColor: undefined,
      //   show_arrow: false,
      //   dataType: FormatType.MONEY
      // };

      this.topCards[3].icon      = "person_apron";
      this.topCards[3].iconColor = "orange";
      this.topCards[3].title     = "Lic. Lojista";
      this.topCards[3].value     = totalLoja as number;
      this.topCards[3].dataType  = FormatType.NUMBER;
      // this.topCards[3].subtitle  = {
      //   text: "Valor/licença: R$ 44,90",
      //   prefix:  undefined,
      //   prefixColor: undefined,
      //   show_arrow: false,
      //   dataType: FormatType.MONEY
      // };

      this.topCards[4].icon      = "network_intelligence_history";
      this.topCards[4].iconColor = "yellow";
      this.topCards[4].title     = "Lic. Lojista (IA)";
      this.topCards[4].value     = totalLojaI as number;
      this.topCards[4].dataType  = FormatType.NUMBER;
      this.topCards[4].disabled  = true;
      // this.topCards[4].subtitle  = {
      //   text: "Valor/licença: R$ 75,50",
      //   prefix:  undefined,
      //   prefixColor: undefined,
      //   show_arrow: false,
      //   dataType: FormatType.MONEY
      // };
      
      this.topCards[5].icon      = "person";
      this.topCards[5].iconColor = "pink";
      this.topCards[5].title     = "Lic. Colaborador";
      this.topCards[5].value     = totalUser as number;
      this.topCards[5].dataType  = FormatType.NUMBER;
      // this.topCards[5].subtitle  = {
      //   text: "Valor/licença: R$ 64,90",
      //   prefix:  undefined,
      //   prefixColor: undefined,
      //   show_arrow: false,
      //   dataType: FormatType.MONEY
      // };
    });
  }

  private mountB2BData():void{

  }

  private mountFPRData():void{

  }

  private mountCRMData():void{
    
  }

  private mountREPRData():void{
    let id_repr:number = parseInt(localStorage.getItem("id_profile") as string);
    const $totalCustomer = this.svcI.reprTotalCustomer(id_repr);
    const $totalOrder    = this.svcI.reprTotalOrder(id_repr);
    const $numTotalOrder = this.svcI.reprCountOrder(id_repr);
    const $represGoal    = this.svcI.reprGoal(id_repr);

    this.serviceSub[0] = forkJoin([$totalCustomer,$totalOrder,$numTotalOrder,$represGoal])
    .subscribe(([totalCustomer,totalOrder,numTotalOrder,represGoal])=>{
      this.topCards[0].icon      = "finance_chip";
      this.topCards[0].iconColor = "green"
      this.topCards[0].title     = "Valor em Pedidos";
      this.topCards[0].value     = totalOrder as number;
      this.topCards[0].dataType  = FormatType.MONEY;

      this.topCards[1].icon      = "order_approve";
      this.topCards[1].iconColor = "blue";
      this.topCards[1].title     = "Nº de Pedidos";
      this.topCards[1].value     = numTotalOrder as number;
      this.topCards[1].dataType  = FormatType.NUMBER;

      this.topCards[2].icon      = "store";
      this.topCards[2].iconColor = "purple";
      this.topCards[2].title     = "Nº de Clientes";
      this.topCards[2].value     = totalCustomer as number;
      this.topCards[2].dataType  = FormatType.NUMBER;

      this.topCards[3].icon      = "apartment";
      this.topCards[3].iconColor = "orange";
      this.topCards[3].title     = "Comissão à receber";
      this.topCards[3].value     = represGoal as number;
      this.topCards[3].dataType  = FormatType.MONEY;
    });
  }

  ngAfterViewInit(): void {
    
    if (this.module== ModuleName.SCM){
      let target:any;
      this.svc.loadTarget((new Date().getFullYear())).subscribe({
        next: (data) =>{
          target = data;
          //console.log(data);
          if (target!=null){
            let today = new Date();
            this.targetMax = parseFloat(target.max_value);
            //verifica qual o tipo da meta
            if(target.type=='Y'){
              this.targetName = "Anual";
              this.bodyMax = parseFloat(target.value_year);
            }else if(target.type=='Q'){
              if (today.getMonth()>= 0 && today.getMonth()<=2){
                this.targetName = "1º Tri";
                this.bodyMax = parseFloat(target.value_quarter1);
              }else if(today.getMonth()>=3 && today.getMonth()<=5){
                this.targetName = "2º Tri";
                this.bodyMax = parseFloat(target.value_quarter2);
              }else if(today.getMonth()>=6 && today.getMonth()<=8){
                this.targetName = "3º Tri";
                this.bodyMax = parseFloat(target.value_quarter3);
              }else{
                this.targetName = "4º Tri";
                this.bodyMax = parseFloat(target.value_quarter4);
              }
            }else{
              switch(today.getMonth()){
                case 0: this.bodyMax = parseFloat(target.value_jan); this.targetName = "Jan."; break;
                case 1: this.bodyMax = parseFloat(target.value_feb); this.targetName = "Fev."; break;
                case 2: this.bodyMax = parseFloat(target.value_mar); this.targetName = "Mar."; break;
                case 3: this.bodyMax = parseFloat(target.value_apr); this.targetName = "Abr."; break;
                case 4: this.bodyMax = parseFloat(target.value_may); this.targetName = "Mai."; break;
                case 5: this.bodyMax = parseFloat(target.value_jun); this.targetName = "Jun."; break;
                case 6: this.bodyMax = parseFloat(target.value_jul); this.targetName = "Jul."; break;
                case 7: this.bodyMax = parseFloat(target.value_aug); this.targetName = "Ago."; break;
                case 8: this.bodyMax = parseFloat(target.value_sep); this.targetName = "Set."; break;
                case 9: this.bodyMax = parseFloat(target.value_oct); this.targetName = "Out."; break;
                case 10: this.bodyMax = parseFloat(target.value_nov); this.targetName = "Nov."; break;
                case 11: this.bodyMax = parseFloat(target.value_dec); this.targetName = "Dez."; break;
              }
            }

            //console.log(this.bodyMax);
            this.targetMax = this.bodyMax + ((this.bodyMax*this.targetMax)/100);
            //console.log(this.targetMax);

            this.mountSCMdata();
          }else{
            this.targetNeed = true;
          }
        }
      });
    }else if(this.module==ModuleName.ADM){
      this.mountAdminData();
    }else if(this.module==ModuleName.CRM){
      this.mountCRMData();
    }else if(this.module==ModuleName.FPR){
      this.mountFPRData();
    }else if(this.module==ModuleName.B2B){
      this.mountB2BData();
    }else if(this.module==ModuleName.ORD){
      this.mountREPRData();
    }
  }
}
