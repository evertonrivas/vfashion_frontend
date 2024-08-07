import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DividerModule } from 'primeng/divider';
import { Common } from '../classes/common';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TreeModule } from 'primeng/tree';
import { TreeNode } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { FormComponent } from '../common/form/form.component';
import { FieldCase, FieldType } from '../models/system.enum';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  standalone:true,
  imports:[
    TreeModule,
    ButtonModule,
    TooltipModule,
    DividerModule,
    CommonModule,
    FormsModule,
    CardModule,
    FormComponent
  ]
})
export class ReportsComponent extends Common implements AfterViewInit{
  reports!:TreeNode[];
  selectedReport!:TreeNode;
  formFolder:boolean = false;
  constructor(route:Router,
    private cdr:ChangeDetectorRef
  ){
    super(route)
  }

  ngAfterViewInit(): void {
    this.reports = [{
      key:'1',
      label:'Vendas',
      data:'sales',
      collapsedIcon: 'pi pi-folder',
      expandedIcon: 'pi pi-folder-open',
      expanded: true,
      children:[
        { label: 'Por Cliente', data: 'vendas-cliente', leaf: true },
        { label: 'Por Coleção', data: 'vendas-colecao', leaf: true },
        { label: 'Por Representante', data: 'vendas-representante', leaf: true },
      ]
    },{
      key: '2',
      label:'Clientes',
      data: 'customers',
      collapsedIcon: 'pi pi-folder',
      expandedIcon: 'pi pi-folder-open',
      expanded: false,
      children:[
        { label:'Ativos', data:'clientes-ativos', leaf:true },
        { label:'Inativos', data:'clientes-inativos', leaf:true },
        { label:'Histórico', data: 'clientes-history', leaf:true },
        { label:'Prospecção', data:'clientes-prospect', leaf:true }
      ]
    },{
      key: '3',
      label: 'Calendário',
      data:'calendar',
      collapsedIcon: 'pi pi-folder',
      expandedIcon: 'pi pi-folder-open',
      expanded: false,
      children: [
        { label: 'Orçamento', data:'calendario-orcamento', leaf:true }
      ]
    },{
      key: '3',
      label: 'CRM',
      data:'crm',
      collapsedIcon: 'pi pi-folder',
      expandedIcon: 'pi pi-folder-open',
      expanded: false,
      children: [
        { label: 'Clientes p/ Funil', data:'crm-cliente-funil', leaf:true }
      ]
    }];
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
}
