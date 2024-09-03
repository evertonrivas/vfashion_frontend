import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Calendar, CalendarModule } from 'primeng/calendar';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarEvent } from 'src/app/models/calendar.model';
import { Funnel } from 'src/app/models/crm.model';
import { Entity } from 'src/app/models/entity.model';
import { Moment } from 'src/app/models/moment.model';
import { City, Country, StateRegion } from 'src/app/models/place.model';
import { Product, ProductCategory, ProductModel, ProductType } from 'src/app/models/product.model';
import { F2bReport, FilePdf } from 'src/app/models/system.enum';
import { CalendarService } from 'src/app/services/calendar.service';
import { CategoryService } from 'src/app/services/category.service';
import { CrmService } from 'src/app/services/crm.service';
import { EntitiesService } from 'src/app/services/entities.service';
import { LocationService } from 'src/app/services/location.service';
import { ModelService } from 'src/app/services/model.service';
import { MomentService } from 'src/app/services/moment.service';
import { ProductTypeService } from 'src/app/services/product.type.service';
import { ProductsService } from 'src/app/services/products.service';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-report-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DividerModule,
    CalendarModule,
    MultiSelectModule,
    DropdownModule
  ],
  templateUrl: './report-view.component.html',
  styleUrl: './report-view.component.scss'
})
export class ReportViewComponent implements OnChanges{
  @Input() isViewMode:boolean = false;
  @Output() isViewModeChange = new EventEmitter<boolean>();
  @Input() reportToView:number = 0;
  @ViewChild('dpp') dpp:Calendar|undefined;
  periodDates:Date[]               = [];
  selectedReport!:F2bReport;

  showFilterCountry:boolean     = false;
  showFilterStateRegion:boolean = false;
  showFilterCity:boolean        = false;
  showFilterPeriod:boolean      = false;
  showFilterMoment:boolean      = false;
  showFilterEntityC:boolean     = false;
  showFilterEntityR:boolean     = false;
  showFilterEvents:boolean      = false;
  showFilterFunnel:boolean      = false;
  showFilterType:boolean        = false;
  showFilterModel:boolean       = false;
  showFilterCategory:boolean    = false;
  showFilterStatusDev:boolean   = false;
  showFilterStatusOrder:boolean = false;

  all_moments:Moment[]             = [];
  all_entities:Entity[]            = [];
  all_products:Product[]           = [];
  all_funnels:Funnel[]             = [];
  all_events:CalendarEvent[]       = [];
  all_types:ProductType[]          = [];
  all_models:ProductModel[]        = [];
  all_categories:ProductCategory[] = [];
  all_countries:Country[]          = [];
  all_state_region:StateRegion[]   = [];
  all_cities:City[]                = [];
  all_status_devol:any[]           = [];
  all_status_order:any[]           = [];

  selected_moments:Moment[]             = [];
  selected_entities:Entity[]            = [];
  selected_products:Product[]           = [];
  selected_funnel?:Funnel;
  selected_events:CalendarEvent[]       = [];
  selected_types:ProductType[]          = [];
  selected_models:ProductModel[]        = [];
  selected_categories:ProductCategory[] = [];
  selected_countries:Country[]          = [];
  selected_state_region:StateRegion[]   = [];
  selected_cities:City[]                = [];
  selected_status_devol:any[]           = [];
  selected_status_order:any[]           = [];

  loading_moments:boolean      = false;
  loading_entities:boolean     = false;
  loading_products:boolean     = false;
  loading_funnels:boolean      = false;
  loading_events:boolean       = false;
  loading_types:boolean        = false;
  loading_models:boolean       = false;
  loading_categories:boolean   = false;
  loading_countries:boolean    = false;
  loading_state_region:boolean = false;
  loading_cities:boolean       = false;
  loading_status_devol:boolean = false;

  loading_report:boolean = false;

  pdf_address!:SafeResourceUrl;

  constructor(private domSanitizer:DomSanitizer,
    private svc:ReportService,
    private svcEn:EntitiesService,
    private svcMm:MomentService,
    private svcMo:ModelService,
    private svcPt:ProductTypeService,
    private svcCr:CrmService,
    private svcCl:CalendarService,
    private svcPr:ProductsService,
    private svcCg:CategoryService,
    private svcLo:LocationService
  ){
    this.pdf_address = this.domSanitizer.bypassSecurityTrustResourceUrl("");

    //status das devolucoes
    this.all_status_devol.push({ label:'Salva', value:'0' });
    this.all_status_devol.push({ label:'Pendente/Em análise', value:'1' });
    this.all_status_devol.push({ label:'Totalmente aprovado', value:'2' });
    this.all_status_devol.push({ label:'Parcialmente aprovado', value:'3' });
    this.all_status_devol.push({ label:'Rejeitado/Recusado', value:'4' });
    this.all_status_devol.push({ label:'Finalizado', value:'5' });

    this.all_status_order.push({ label: 'Em análise', value:'0'});
    this.all_status_order.push({ label: 'Enviado', value:'1'});
    this.all_status_order.push({ label: 'Em processamento', value:'2'});
    this.all_status_order.push({ label: 'Em transporte', value:'3'});
    this.all_status_order.push({ label: 'Finalizado', value:'4'});
    this.all_status_order.push({ label: 'Rejeitado', value:'5'});
  }

  resetAll():void{
    this.periodDates      = [];
    this.all_moments      = [];
    this.all_entities     = [];
    this.all_products     = [];
    this.all_funnels      = [];
    this.all_events       = [];
    this.all_types        = [];
    this.all_models       = [];
    this.all_categories   = [];
    this.all_countries    = [];
    this.all_state_region = [];
    this.all_cities       = [];

    this.selected_moments      = [];
    this.selected_entities     = [];
    this.selected_products     = [];
    this.selected_funnel       = undefined;
    this.selected_events       = [];
    this.selected_types        = [];
    this.selected_models       = [];
    this.selected_categories   = [];
    this.selected_countries    = [];
    this.selected_state_region = [];
    this.selected_cities       = [];
    this.selected_status_devol = [];

    this.showFilterCountry     = false;
    this.showFilterStateRegion = false;
    this.showFilterCity        = false;
    this.showFilterPeriod      = false;
    this.showFilterMoment      = false;
    this.showFilterEntityC     = false;
    this.showFilterEntityR     = false;
    this.showFilterEvents      = false;
    this.showFilterFunnel      = false;
    this.showFilterType        = false;
    this.showFilterModel       = false;
    this.showFilterCategory    = false;
    this.showFilterStatusDev   = false;
    this.showFilterStatusOrder = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.isViewModeChange.emit(this.isViewMode);

    //reseta tudo
    this.resetAll();

    this.pdf_address = this.domSanitizer.bypassSecurityTrustResourceUrl("");
    //sigifica que nao eh mais o primeiro clique
    if(changes.hasOwnProperty("reportToView")){
      if (this.reportToView > 0){
        this.svc.load(this.reportToView).subscribe({
          next: (data) =>{
            if(data.hasOwnProperty("name")){
              this.selectedReport = data as F2bReport
              if(this.selectedReport.filters.find(f => f=='countries')){
                this.showFilterCountry = true;
                this.loadingCountries();
              }
              if(this.selectedReport.filters.find(f => f=='state_regions')){
                this.showFilterStateRegion = true;
              }
              if(this.selectedReport.filters.find(f => f=='cities')){
                this.showFilterCity = true;
              }
              if(this.selectedReport.filters.find(f => f=='period')){
                this.showFilterPeriod = true;
              }
              if(this.selectedReport.filters.find(f => f=='moments')){
                this.showFilterModel = true;
                this.loadingMoments();
              }
              if(this.selectedReport.filters.find(f => f=='customers')){
                this.showFilterEntityC = true;
                this.loadingEntity('C');
              }
              if(this.selectedReport.filters.find(f => f=='representatives')){
                this.showFilterEntityR = true;
                this.loadingEntity('R');
              }
              if(this.selectedReport.filters.find(f => f=='funnels')){
                this.showFilterFunnel = true;
                this.loadingFunnels();
              }
              if(this.selectedReport.filters.find(f => f=='product_types')){
                this.showFilterType = true;
                this.loadingTypes();
              }
              if(this.selectedReport.filters.find(f => f=='product_models')){
                this.showFilterModel = true;
                this.loadingModels();
              }
              if(this.selectedReport.filters.find(f => f=='product_categories')){
                this.showFilterCategory = true;
                this.loadingCategories();
              }
              if(this.selectedReport.filters.find(f => f=='status_devolution')){
                this.showFilterStatusDev = true;
              }
              if(this.selectedReport.filters.find(f => f=='status_order')){
                this.showFilterStatusOrder = true;
              }
            }else{
  
            }
          }
        });
      }
    }
  }

  loadingEntity(type:string):void{
    this.loading_entities = true;
    this.svcEn.listEntity({page:1,pageSize:1,query:'can:list-all 1||is:type '+type}).subscribe({
      next: (data) =>{
        this.all_entities = data as Entity[];
        this.loading_entities = false;
      }
    });
  }

  loadingMoments():void{
    this.loading_moments = true;
    this.svcMm.list({page:1,pageSize:1,query:'can:list-all 1||order-by name'}).subscribe({
      next: (data) =>{
        this.all_moments = data as Moment[];
        this.loading_moments = false;
      }
    });
  }

  loadingEvents():void{
    // this.loading_events = true;
    // this.svcC.calendarEventLoad({page:1,pageSize:1,query:'can:list-all 1||order-by name'}).subscribe({
    //   next: (data) =>{
    //     this.all_events = data as CalendarEvent[];
    //     this.loading_events = false;
    //   }
    // });
  }

  loadingTypes():void{
    this.loading_types = true;
    this.svcPt.list({page:1,pageSize:1,query:'can:list-all 1||is:order-by name'}).subscribe({
      next: (data) =>{
        this.all_types = data as ProductType[];
        this.loading_types = false;
      }
    });
  }

  loadingModels():void{
    this.loading_models = true;
    this.svcMo.list({page:1,pageSize:1,query:'can:list-all 1||is:order-by name'}).subscribe({
      next: (data) =>{
        this.all_models = data as ProductModel[];
        this.loading_models = false;
      }
    });
  }

  loadingCategories():void{
    this.loading_categories = true;
    this.svcCg.list({page:1,pageSize:1,query:'can:list-all 1||is:order-by name'}).subscribe({
      next: (data) =>{
        this.all_categories = data as ProductCategory[];
        this.loading_categories = false;
      }
    })
  }

  loadingFunnels():void{
    this.loading_funnels = true;
    this.svcCr.getFunnels({page:1,pageSize:1,query:'can:list-all 1||is:order-by name'}).subscribe({
      next: (data) =>{
        this.all_funnels = data as Funnel[];
        this.loading_funnels = false;
      }
    })
  }

  loadingCountries():void{
    this.loading_countries = true;
    this.svcLo.listCountries({page:1,pageSize:1,query:"can:list-all 1||is:order-by name"}).subscribe({
      next: (data) =>{
        this.all_countries = data as Country[];
        this.loading_countries = false;
      }
    })
  }

  loadingStateRegion():void{
    let ids:number[] = [];
    this.selected_countries.forEach(c =>{
      ids.push(c.id);
    });
    this.loading_state_region = true;
    this.svcLo.listStageRegions({page:1,pageSize:1,query:'can:list-all 1||is:country '+ids.join(",")+"||is:order-by name"}).subscribe({
      next: (data) =>{
        this.all_state_region = data as StateRegion[];
        this.loading_state_region = false;
      }
    });
  }

  loadingCity():void{
    let ids:number[] = [];
    this.selected_state_region.forEach(c =>{
      ids.push(c.id);
    });
    this.loading_cities = true;
    this.svcLo.listCities({page:1,pageSize:1,query:"can:list-all 1||is:state-region "+ids.join(",")+"||is:order-by name"}).subscribe({
      next: (data) =>{
        this.all_cities = data as City[];
        this.loading_cities = false;
      }
    });

  }

  onDateChanged():void{
    if(this.periodDates!=null){
      if(this.periodDates[1]!=null){
        this.dpp?.toggle();
        //console.log(this.periodDates);
        // this.options.query = "is:start "+this.periodDates[0].toISOString().substring(0,10)+"||is:end "+this.periodDates[1].toISOString().substring(0,10);
        // this.loadData();
      }
    }else{
      // this.options.query = "is:start ||is:end ";
      // this.loadData();
    }
  }

  onReportView():void{
    let params:any[] = [];
    let ids:number[] = [];

    params.push({id_funnels: (this.selected_funnel!=undefined?this.selected_funnel?.id:0)});

    this.selected_categories.forEach(c =>{ ids.push(c.id) });
    params.push({ id_categories: ids });

    if(this.periodDates.length > 0){
      params.push({
        date_start: this.periodDates[0].toISOString().substring(0,10),
        date_end: this.periodDates[1].toISOString().substring(0,10)
      });
    }

    ids = [];
    this.selected_entities.forEach(e =>{ ids.push(e.id) });
    params.push({ id_entities: ids });

    ids = [];
    this.selected_models.forEach(m =>{ ids.push(m.id) });
    params.push({ id_models: ids });

    ids = [];
    this.selected_types.forEach(t =>{ ids.push(t.id) });
    params.push({ id_types: ids });

    ids = [];
    this.selected_countries.forEach(c =>{ ids.push(c.id) });
    params.push({ id_countries: ids});

    ids = [];
    this.selected_state_region.forEach(s =>{ ids.push(s.id)});
    params.push({ id_state_regions: ids});

    ids = [];
    this.selected_cities.forEach(s =>{ ids.push(s.id)});
    params.push({ id_cities: ids});

    ids = [];
    this.selected_status_devol.forEach(s =>{ ids.push(s.value); });
    params.push({ id_status_devol:ids });

    ids = [];
    this.selected_status_order.forEach(s =>{ ids.push(s.value); });
    params.push({ id_status_order:ids });

    this.loading_report = true;
    this.svc.open(
      this.selectedReport.id,
      params
    ).subscribe({
      next: (data) =>{
        const pdf = data as FilePdf;

        const byteArray  = new Uint8Array(atob(pdf.content).split('').map(char => char.charCodeAt(0)));
        const fBlob      = new Blob([byteArray],{'type':'application/pdf'});
        this.pdf_address = this.domSanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(fBlob));
        this.loading_report = false;
      }
    });
  }
}
