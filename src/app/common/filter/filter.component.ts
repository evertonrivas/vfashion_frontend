import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../common/shared.module';
import { Field } from '../../models/field.model';
import { FieldType } from '../../models/system.enum';
import { SysFilterService } from 'src/app/services/sys.filter.service';

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
export class FilterComponent{
  @Input() visible:boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() fields!:Field[];
  fieldType = FieldType;
  constructor(
    private svc:SysFilterService,
    private cdr:ChangeDetectorRef){
  }

  doFilter():void{
    let filter:string = "";
    this.fields.forEach((f)=>{
      if (f.value!=undefined){
        filter += f.filter_prefix+":"+f.filter_name+" "+f.value+"||";
      }
    });
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.svc.announceSysFilter(filter);
  }

  onDateChanged():void{

  }

  clearFilter(announce:boolean = true):void{
    this.fields.forEach((f) =>{
      f.value = undefined;
    });
    this.visible = false;
    this.visibleChange.emit(this.visible);
    if(announce!=false)
      this.svc.announceSysFilter("");
  }
}
