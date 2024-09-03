import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { SharedModule } from '../shared.module';
import { CardModule } from 'primeng/card';
import { TreeModule, TreeNodeSelectEvent } from 'primeng/tree';
import { FormComponent } from '../form/form.component';
import { Router } from '@angular/router';
import { TreeNode } from 'primeng/api';
import { F2bReport, FieldCase, FieldType, ReportsCategory } from 'src/app/models/system.enum';
import { Common } from 'src/app/classes/common';
import { ReportViewComponent } from "./report-view/report-view.component";
import { ReportService } from 'src/app/services/report.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-report-manager',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    CardModule,
    TreeModule,
    FormComponent,
    ReportViewComponent
],
  templateUrl: './report-manager.component.html',
  styleUrl: './report-manager.component.scss'
})
export class ReportManagerComponent extends Common implements AfterViewInit{
  t_reports!:TreeNode[];
  selectedReport!:TreeNode;
  formFolder:boolean = false;
  viewReport:boolean = false;
  reportView:number = 0;
  reportFilters:string[] = [];
  constructor(route:Router,
    private svc:ReportService,
    private cdr:ChangeDetectorRef
  ){
    super(route);
  }

  ngAfterViewInit(): void {

    //lista os relatorios usando forkjoin por categoria
    const $customer   = this.svc.list({page:1,pageSize:1,query:'can:list-all 1||is:category '+ReportsCategory.CUSTOMER });
    const $calendar   = this.svc.list({page:1,pageSize:1,query:'can:list-all 1||is:category '+ReportsCategory.CALENDAR});
    const $crm        = this.svc.list({page:1,pageSize:1,query:'can:list-all 1||is:category '+ReportsCategory.CRM});
    const $devolution = this.svc.list({page:1,pageSize:1,query:'can:list-all 1||is:category '+ReportsCategory.DEVOLUTION});
    const $order      = this.svc.list({page:1,pageSize:1,query:'can:list-all 1||is:category '+ReportsCategory.ORDER});

    this.serviceSub[0] = forkJoin([$customer,$calendar,$crm,$devolution,$order]).subscribe(([valCust,valCalend,valCRM,valDev,valOrd])=>{
      let childCus:TreeNode<any>[] = [];
      let childCal:TreeNode<any>[] = [];
      let childCrm:TreeNode<any>[] = [];
      let childDev:TreeNode<any>[] = [];
      let childOrd:TreeNode<any>[] = [];

      (valCust as F2bReport[]).forEach(r =>{ childCus.push({ label: r.name, data: r.id, leaf: true}); });
      (valCalend as F2bReport[]).forEach(r =>{ childCal.push({ label: r.name, data: r.id, leaf: true}); });
      (valCRM as F2bReport[]).forEach(r =>{ childCrm.push({ label: r.name, data: r.id, leaf: true}); });
      (valDev as F2bReport[]).forEach(r =>{ childDev.push({ label: r.name, data: r.id, leaf: true}); });
      (valOrd as F2bReport[]).forEach(r =>{ childOrd.push({ label: r.name, data: r.id, leaf: true}); });

      this.t_reports = [{
        key: '1',
        label: 'Clientes',
        data: 'folder-customers',
        collapsedIcon: 'pi pi-folder',
        expandedIcon: 'pi pi-folder-open',
        expanded: true,
        children:childCus
      },{
        key: '2',
        label: 'Calendário',
        data:'folder-calendar',
        collapsedIcon: 'pi pi-folder',
        expandedIcon: 'pi pi-folder-open',
        expanded: false,
        children: childCal
      },{
        key: '3',
        label: 'CRM',
        data:'folder-crm',
        collapsedIcon: 'pi pi-folder',
        expandedIcon: 'pi pi-folder-open',
        expanded: false,
        children: childCrm
      },{
        key: '4',
        label: 'Devoluções',
        data: 'folder-devolution',
        collapsedIcon: 'pi pi-folder',
        expandedIcon: 'pi pi-folder-open',
        expanded: false,
        children: childDev
      },{
        key:'5',
        label:'Pedidos',
        data:'folder-orders',
        collapsedIcon: 'pi pi-folder',
        expandedIcon: 'pi pi-folder-open',
        expanded: false,
        children: childOrd
      }]
    });

    this.cdr.detectChanges();
  }

  onSaveFolder(data:any):void{

  }

  onSaveReport(data:any):void{

  }


  onNewFolder():void{
    //limpa as linhas do formulario
    this.formRows = [];
    this.formRows.push({
      fields:[{
        name: 'name',
        label: 'Nome',
        placeholder: 'Nome...',
        case: FieldCase.NONE,
        disabled: false,
        lockField: undefined,
        options: undefined,
        required: true,
        type: FieldType.INPUT,
        value: undefined
      }]
    });
    this.formFolder = true;
  }

  onNewReport():void{
    this.formRows = [];
    this.formRows.push({
      fields:[{
        name: 'name',
        label: 'Nome',
        placeholder: 'Nome...',
        case: FieldCase.NONE,
        disabled: false,
        lockField: undefined,
        options: undefined,
        required: true,
        type: FieldType.INPUT,
        value: undefined
      }]
    });
    this.formRows.push({
      fields:[{
        name:'content',
        label: 'Conteúdo',
        placeholder: undefined,
        case: FieldCase.NONE,
        disabled: false,
        lockField: undefined,
        options: undefined,
        required:true,
        type: FieldType.TEXT,
        value: undefined
      }]
    })
    this.formVisible = true;
  }

  openReport(evt:TreeNodeSelectEvent):void{
    if(typeof evt.node.data === 'number'){
      this.reportView = evt.node.data as number;
      this.viewReport = true;
    }else{
      this.viewReport = false;
    }
  }
}
