import { Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../common/shared.module';
import { Field } from '../../models/field.model';
import { FieldType } from '../../models/system.enum';
import { Common } from 'src/app/classes/common';
import { Router } from '@angular/router';
import { SysFilterService } from 'src/app/services/sys.filter.service';
import { OverlayPanel } from 'primeng/overlaypanel';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule
  ],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss'
})
export class FilterComponent extends Common{
  @Input() pnlFilter!:OverlayPanel;
  @Input() fields!:Field[];
  fieldType = FieldType;
  constructor(route:Router,
    private svc:SysFilterService){
    super(route);
  }

  doFilter():void{
    let filter:string = "";
    this.fields.forEach((f)=>{
      if (f.value!=undefined){
        filter += f.filter_prefix+":"+f.filter_name+" "+f.value+"||";
      }
    });
    this.pnlFilter.overlayVisible = false;
    this.svc.announceSysFilter(filter);
  }

  onDateChanged():void{

  }

  clearFilter():void{
    this.fields.forEach((f) =>{
      f.value = undefined;
    });
    this.pnlFilter.overlayVisible = false;
    this.svc.announceSysFilter("");
  }
}
