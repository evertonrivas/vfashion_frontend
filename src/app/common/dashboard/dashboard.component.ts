import { Component,OnInit,OnDestroy, AfterViewInit } from '@angular/core';
import { EChartsOption, MarkLineComponentOption } from 'echarts';
import { Card } from 'src/app/models/card.model';
import { CardComponent, FormatType } from './card/card.component';
import { EntityType } from 'src/app/models/entity.model';
import { Router } from '@angular/router';
import { AccessLevel, ModuleName } from 'src/app/models/system.enum';
import { Common } from 'src/app/classes/common';
import { formatCurrency } from '@angular/common';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { NgxEchartsModule, NGX_ECHARTS_CONFIG } from 'ngx-echarts';
import { CardModule } from 'primeng/card';

import * as echarts from 'echarts';
import { IndicatorsService } from 'src/app/services/indicators.service';
import { SecurityService } from 'src/app/services/security.service';


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
  symbols = [
    'path://M393.33984,553.72894L393.38275,553.75977L393.38278,553.75977Q393.44302,553.75977,393.69147,554.2988Q394.1939,555.4278,394.61487,556.4893Q396.56314,561.5283,398.18414,566.0636Q398.07343,566.2932,393.70395,571.0733Q392.38486,572.39386,392.2804,572.39386Q392.27023,572.39386,392.27158,572.38135Q391.9469,571.53424,391.2688,566.23517Q391.01053,563.96875,391.05908,561.8784Q391.25845,559.842,391.6055,558.5828Q391.9672,557.1803,392.67645,555.1591Q393.1086,554.0509,393.33984,553.72894 Z M442.0605,638.8342L442.06052,638.8343L442.06046,638.8342 Z M380.85333,676.1991Q380.81616,676.2066,380.73773,676.30774Q380.79678,676.2532,380.85715,676.1991 Z M400.53635,694.08105L400.53058,694.1064L400.51047,694.1956L400.51294,694.19586L400.51913,694.1944L400.52454,694.1901L400.5291,694.1831L400.533,694.1731L400.536,694.1604L400.5383,694.1448L400.53976,694.12634L400.54047,694.10516L400.54037,694.08105L400.53635,694.08203L400.53635,694.08105 Z M400.50485,694.2211L400.5024,694.23236Q400.49335,694.274,400.48425,694.31604L400.48715,694.31604L400.4911,694.3084L400.4947,694.2995L400.49792,694.2895L400.50082,694.2782L400.50333,694.26575L400.50555,694.2521L400.5074,694.2372L400.50888,694.2211L400.50485,694.2221L400.50485,694.2211 Z M400.47842,694.34393L400.46362,694.4155L400.41144,694.6697L400.42508,694.65106L400.4373,694.628L400.44806,694.60065L400.45737,694.56885L400.46527,694.53265L400.4717,694.492L400.47675,694.4471L400.48032,694.39777L400.48242,694.34393L400.47842,694.3449L400.47842,694.34393 Z M402.90082,499.18582Q402.20255,499.18582,401.3879,499.35635L400.69894,499.5291Q400.0007,499.73077,399.27188,500.02698Q398.52716,500.27457,396.87894,501.1584L396.87497,501.1584Q393.17688,501.93066,391.00995,503.7067Q390.4356,504.10147,388.87527,505.96347L385.91837,510.8428Q384.9677,511.9979,383.53146,512.5296Q383.28458,512.6297,382.98523,512.6297Q382.3221,512.6297,381.40152,512.1386L377.87006,508.49942Q376.90698,507.79996,376.28406,507.79996Q376.07693,507.79996,375.90744,507.8773L377.1231,508.77182Q378.21967,511.75784,380.07355,513.10406Q380.81888,513.5252,381.74423,513.5252Q382.59723,513.5252,383.60315,513.16736L383.607,513.16736Q383.07993,513.7448,382.23944,513.8984Q381.44647,514.0936,381.08682,514.0936Q381.03864,514.0936,380.99823,514.09015Q379.43063,513.7437,379.0385,513.46356Q378.32227,513.05475,377.75848,512.5599Q374.80844,509.54208,374.24963,509.17966Q372.2933,507.76666,371.26553,507.7533L371.2618,507.7533L373.24664,509.34012Q375.98724,513.53595,378.17456,514.7564Q379.5315,515.37286,380.93433,515.37286Q382.14728,515.37286,383.39453,514.912L383.39838,514.912Q383.1766,515.47943,381.2659,516.1409Q380.41315,516.3012,379.66473,516.3012Q378.33798,516.3012,377.33914,515.79755Q376.8229,515.6026,375.1678,514.6471Q371.6878,512.0869,370.37125,511.49112Q368.0639,510.37094,365.76547,510.356Q365.64346,510.3506,365.51077,510.3506Q364.42667,510.3506,362.63052,510.71048Q361.1601,511.0997,359.96133,511.71854L358.88315,511.96872Q358.69974,511.9941,358.50433,511.9941Q357.845,511.9941,357.04922,511.70502L357.04565,511.70502Q356.52368,511.7548,357.823,512.5613L357.71115,512.7593Q357.201,513.0841,355.25232,513.36926Q354.37296,513.54504,353.5718,513.54504Q351.67194,513.54504,350.2119,512.5565L350.2084,512.5565Q350.90332,513.6074,352.31625,514.0293Q353.78452,514.3126,355.02322,514.3126Q356.0778,514.3126,356.96594,514.1073L356.9695,514.1073Q355.82336,515.23706,352.55963,516.0475Q351.78723,516.17694,351.08124,516.17694Q350.25308,516.17694,349.51633,515.9988Q348.87244,515.85345,346.34457,514.457L346.3411,514.457Q348.72235,517.1859,351.4118,517.68414Q352.56027,517.8738,353.67218,517.8738Q354.31155,517.8738,354.9388,517.8111L362.25293,516.574Q363.44885,516.42523,364.43835,516.42523Q364.6021,516.42523,364.76022,516.4293Q367.70676,516.4602,370.93414,518.30865Q370.9087,518.3693,370.7094,518.3693Q370.59845,518.3693,370.4336,518.3505Q368.06412,517.4966,365.28067,516.9391Q364.8786,516.85956,363.9944,516.85956Q363.47208,516.85956,362.7815,516.8873Q361.86197,516.93274,360.7293,517.2457L354.72095,519.4195Q354.61835,519.46606,354.35715,519.46606Q353.80426,519.46606,352.5407,519.25745L352.53717,519.25745Q353.1391,520.00684,354.84802,520.00684Q355.3819,520.00684,356.0238,519.9337L356.02737,519.9337Q356.017,519.96375,356.07828,519.96375Q356.57886,519.96375,361.86066,517.9598Q363.13882,517.6227,364.6001,517.57434Q364.91827,517.5522,365.24014,517.5522Q367.88113,517.5522,370.7704,519.045Q370.77258,519.1569,370.50375,519.17755Q369.8629,519.10236,369.29633,519.10236Q368.5876,519.10236,367.995,519.22003Q367.41415,519.2885,365.80774,519.81744Q365.51547,519.8859,364.50668,520.50824L360.24063,523.25323Q359.22485,523.7482,358.30948,523.7482Q357.6576,523.7482,357.0566,523.4972L357.05304,523.4972Q357.7448,524.64435,359.41333,524.64435Q359.8173,524.64435,360.2785,524.5771Q360.92886,524.47504,361.92233,524.0794Q365.01068,522.44354,366.12775,522.1004Q367.3868,521.6886,367.86932,521.6886Q368.00238,521.6886,368.0764,521.7199Q361.10806,526.404,359.162,526.70807Q358.0638,526.96686,357.20404,526.96686Q356.32483,526.96686,355.69498,526.6962Q354.52756,526.58276,353.22845,523.92975L353.2249,523.92975Q353.63525,527.50494,356.3352,528.4395Q357.57712,529.0151,359.59106,529.0151Q359.6676,529.0151,359.74527,529.0142Q360.70523,528.95355,361.5219,528.77435Q362.38898,528.5959,363.4166,528.12164Q363.70746,528.0457,363.8769,528.0457Q364.00702,528.0457,364.0655,528.0905Q361.28607,529.7205,359.14694,529.7432Q355.6809,529.62555,353.85358,528.17755L353.85004,528.17755Q353.79758,528.6819,355.36185,529.51874Q356.96063,530.2402,358.76843,530.2402Q359.98584,530.2402,361.29803,529.913Q363.02188,529.24994,363.23602,529.092Q367.14398,525.9322,368.9301,525.0572Q369.66153,524.70953,371.91995,524.34796Q373.79767,524.3597,375.59128,524.96375L375.58752,524.96375Q375.78168,525.36945,376.0378,525.72687L376.03406,525.72687L375.78174,525.8319L375.78174,525.8319Q374.8442,525.49023,373.89255,525.3328Q373.3429,525.23486,372.588,525.23486Q371.66782,525.23486,370.44266,525.38043Q368.012,526.154,366.48267,527.5705Q369.55902,526.6264,370.2353,526.5467Q371.98288,526.5716,373.55392,527.04486Q374.00656,527.24347,374.39212,527.4254L374.3884,527.4254Q374.64285,527.6864,375.30896,528.2439L375.30896,528.2439Q374.23343,527.7412,372.94672,527.5362Q372.4096,527.44855,371.94485,527.44855Q371.04965,527.44855,370.42303,527.77374Q370.4928,527.77313,370.5617,527.77313Q373.37457,527.77313,374.74283,528.785Q375.62445,528.9948,379.84863,533.0669Q380.40677,533.5569,381.61734,534.2267Q384.07956,535.434,386.18643,535.434Q387.21735,535.434,388.16318,535.14496Q388.84296,534.98175,389.50446,534.71533L389.50836,534.71533Q389.46695,534.8357,389.42554,534.9574Q386.50323,542.79974,383.61197,562.2886Q384.1745,570.5614,386.88892,579.68646Q378.03552,593.17944,369.92252,610.15515Q366.95453,615.9727,360.60822,636.0459Q362.56693,639.4109,365.4676,640.5337Q367.74875,641.69476,378.75134,644.2106Q380.03378,646.4634,382.35315,647.6225Q384.41083,648.584,395.9251,650.19617L387.9061,669.42444L385.17474,673.5497Q382.52368,674.7053,380.85773,676.19855L380.8609,676.19855Q381.226,676.22797,376.45163,687.92584L380.17496,683.8442Q380.4415,683.59717,380.78754,683.59717Q381.0627,683.59717,381.3882,683.7534Q381.74994,683.86945,381.89163,684.9975L380.5386,689.8279Q380.58588,691.498,381.0344,692.0086Q381.59766,693.33716,390.4712,695.9961Q390.82718,695.80774,390.23737,694.34094L387.16278,690.0376Q390.58936,679.44275,390.197,679.41705L390.19308,679.41705Q390.15088,679.41974,390.06836,679.53394L390.0668,679.53394L390.85754,677.84204Q394.1231,671.1113,398.85974,665.3348L398.86374,665.3348Q402.1265,676.1238,398.0971,683.3932Q400.18002,691.65076,400.53995,694.0652Q401.65775,689.42285,401.91974,688.80597L403.55228,690.02954Q404.96448,694.9816,405.33994,695.6396Q409.12253,696.0812,411.5072,696.0812Q413.65054,696.0812,414.66458,695.7244Q416.246,695.2662,417.03494,694.411L410.78146,690.60046L407.73404,681.5432Q407.30707,675.78046,407.2458,658.56995Q407.21085,654.1747,408.04193,651.97595L417.41098,650.6637L422.73843,649.0539Q423.9468,648.5075,423.52484,648.4566L423.52908,648.4566Q424.0252,648.4901,424.57385,648.4901Q429.84164,648.4901,439.95294,645.40533Q444.16702,643.04865,444.9942,640.55457L452.56766,638.4093L454.7472,635.4745L446.3653,611.0682L438.16907,594.7551Q428.95154,580.75635,416.47684,565.34064L413.61948,551.1249L415.6629,545.4659L415.61,542.7761Q408.76086,535.21954,404.4976,531.8075L402.79858,529.0369Q403.18314,527.41565,403.5855,525.81104L403.58148,525.81104Q403.60864,525.7977,403.6359,525.7844L403.86917,524.70636L403.8651,524.70636Q403.90643,524.5447,403.94794,524.3832L403.9439,524.3832L403.9388,524.3846L404.5057,521.76465Q404.68292,521.2029,404.84497,521.14014Q408.57672,520.7549,409.44443,520.4275Q410.48505,520.21545,410.81326,519.33954Q411.04724,518.9045,410.7144,517.4378Q411.16858,516.6578,411.1332,516.20135Q411.20355,515.93536,410.25613,515.40546Q410.75568,514.7083,410.72586,514.4526L409.78983,513.4168Q410.64355,511.69724,410.4531,511.37985L410.2021,511.0834Q408.94135,510.8394,408.02585,510.23495Q407.57114,509.93124,407.93802,509.33682Q407.3746,509.32614,407.3074,509.23178Q406.88937,508.17877,406.53644,507.18274L406.53238,507.18274Q406.78033,506.7864,406.9895,506.39853Q407.17166,506.0427,407.28763,505.70132L407.3829,505.36447L407.40887,505.20654L407.4048,505.20654Q407.70404,504.92685,407.89954,504.60196L408.07336,504.24747Q408.21634,503.88107,408.2206,503.47318Q408.22165,502.6404,407.64206,501.7378Q407.06183,500.8346,406.02832,500.13953Q404.99484,499.4445,403.6381,499.23807Q403.28726,499.18582,402.90082,499.18582 Z'
  ];
  bodyMax = 30000000;
  
  //cards do topo
  topCards:Card[] = []
  
  constructor(private svcI:IndicatorsService,
    private svcU:SecurityService,
    route:Router){
      super(route)
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
        text:null
      }
      this.topCards.push(card);
    }
  }

  private mountSCMdata():void{
    const $valueOrder  = this.svcI.calendarValueOrder();
    const $countOrder  = this.svcI.calendarCountOrder();
    const $countCustomer = this.svcI.calendarCountEntity(EntityType.C);
    const $countRepresentative = this.svcI.calendarCountEntity(EntityType.R);

    this.serviceSub[0] = forkJoin([$valueOrder,$countOrder,$countCustomer,$countRepresentative]).subscribe(([valueOrder,countOrder,countCustomer,countRep])=>{
      this.topCards[0].icon      = "finance_chip";
      this.topCards[0].iconColor = "green"
      this.topCards[0].title     = "Valor em Pedidos";
      this.topCards[0].value     = valueOrder as number;
      this.topCards[0].dataType  = FormatType.MONEY;

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
    });
    
    //firstChart
    this.firstChartOption = {
      tooltip:{
        trigger: 'axis',
        axisPointer:{
          type: 'shadow'
        },
        valueFormatter: (value) => formatCurrency(parseFloat(value.toString()),"pt","R$")
      },
      legend:{},
      grid:{
        left:'3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
        tooltip:{
          formatter: function(params: { value: any; }){
            console.log(params.value);
          }
        }
      },
      xAxis:{
        type: 'value',
        boundaryGap: [0,0.01]
      },
      yAxis:{
        type: 'category',
        data:['José','Paulo','Vieira','Constantino','Makoto & Makoto']
      },
      series:[{
        name: 'Última Coleção',
        type: 'bar',
        data:[10000, 25000, 15000, 12000, 18000],
        markLine:{
          data:[{ 
            name: 'supermeta', symbol: 'none', xAxis: 30000, 
            label:{
              formatter: (item) => 'Super \n'+formatCurrency(parseFloat(item.value.toString()),"pt","R$")
            },
            lineStyle:{
              color: '#ffc107',
              type: 'dotted',
              join: 'round'
            }
          },{
            name: 'meta', symbol: 'none', xAxis: 25000,
            label:{
              formatter: (item) => 'Meta \n'+ formatCurrency(parseFloat(item.value.toString()),"pt","R$")
            },
            lineStyle:{
              color: '#198754',
              type: 'dotted',
              join: 'round'
            }
          }],
          symbol: 'circle'
        }
      }]
    }


    const meuBodyMax = this.bodyMax;

    //secondChart
    this.secondChartOption = {
      tooltip: {
        valueFormatter: (value) => formatCurrency(parseFloat(value.toString()),"pt","R$")
      },
      legend: {
        data:['Última Coleção'],
       },
      xAxis: {
        data: ['a'],
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
        z: -100
      },
      series: [
        {
          name: 'Última Coleção',
          type: 'pictorialBar',
          symbolClip: true,
          symbolBoundingData: this.bodyMax,
          color:'#e685b5',
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
              value: 25000000,
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

      this.topCards[1].icon      = "shield_person";
      this.topCards[1].iconColor = "blue";
      this.topCards[1].title     = "Lic. Administrador";
      this.topCards[1].value     = totalAdmin as number;
      this.topCards[1].dataType  = FormatType.NUMBER;

      this.topCards[2].icon      = "account_circle";
      this.topCards[2].iconColor = "purple";
      this.topCards[2].title     = "Lic. Representante";
      this.topCards[2].value     = totalRepre as number;
      this.topCards[2].dataType  = FormatType.NUMBER;

      this.topCards[3].icon      = "person_apron";
      this.topCards[3].iconColor = "orange";
      this.topCards[3].title     = "Lic. Lojista";
      this.topCards[3].value     = totalLoja as number;
      this.topCards[3].dataType  = FormatType.NUMBER;


      this.topCards[4].icon      = "network_intelligence_history";
      this.topCards[4].iconColor = "yellow";
      this.topCards[4].title     = "Lic. Lojista (IA)";
      this.topCards[4].value     = totalLojaI as number;
      this.topCards[4].dataType  = FormatType.NUMBER;
      
      this.topCards[5].icon      = "person";
      this.topCards[5].iconColor = "gray";
      this.topCards[5].title     = "Lic. Colaborador";
      this.topCards[5].value     = totalUser as number;
      this.topCards[5].dataType  = FormatType.NUMBER;
    });
  }

  private mountB2BData():void{

  }

  private mountFPRData():void{

  }

  private mountCRMData():void{

  }

  ngAfterViewInit(): void {
    
    if (this.module== ModuleName.SCM){
      this.mountSCMdata();
    }else if(this.module==ModuleName.ADM){
      this.mountAdminData();
    }else if(this.module==ModuleName.CRM){
      this.mountCRMData();
    }else if(this.module==ModuleName.FPR){
      this.mountFPRData();
    }else if(this.module==ModuleName.B2B){
      this.mountB2BData();
    }
  }
}
