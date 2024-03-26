import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../common/shared.module';
import { FieldFilter } from '../../models/field.model';
import { FieldType } from '../../models/system.enum';
import { SysService } from 'src/app/services/sys.service';

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
  @Output() queryToFilter = new EventEmitter<string>();
  @Input() fields!:FieldFilter[];
  @Input() isTrash:boolean = false;
  fieldType = FieldType;
  constructor(
    private svc:SysService,
    private cdr:ChangeDetectorRef){
  }

  doFilter():void{
    let filter:string = "";
    this.fields.forEach((f)=>{
      if (f.value!=undefined){
        if(typeof f.value ==='boolean'){
          filter += f.filter_prefix+":"+f.filter_name+" "+(f.value==true?"1":"0")+"||";
        }else{
          filter += f.filter_prefix+":"+f.filter_name+" "+f.value+"||";
        }
      }
    });
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.queryToFilter.emit(filter+(this.isTrash==true?"trash 1||":""));
    this.cdr.detectChanges();
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
      this.queryToFilter.emit("");
  }
}
