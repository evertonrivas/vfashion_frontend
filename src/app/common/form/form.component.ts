import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedModule } from '../shared.module';
import { CommonModule } from '@angular/common';
import { FieldCase, FieldType } from 'src/app/models/system.enum';
import { FormRow } from 'src/app/models/field.model';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {
  @Input() visible:boolean = false;
  @Output() visibleChange  = new EventEmitter<boolean>();
  @Output() objectToSave   = new EventEmitter<any>();
  @Input() rows!:FormRow[];
  @Input() title:string = "";
  @Input() registryId:number = 0;
  fieldType = FieldType;
  fieldCase = FieldCase;
  dataToSave:string = "";

  constructor(){

  }

  onDateChanged():void{

  }

  doSave():void{
    this.visible = false;
    this.visibleChange.emit(this.visible);

    this.dataToSave = '{"id":"'+this.registryId.toString()+'"';
    this.rows.forEach((r) =>{
      r.fields.forEach((f) =>{
        if (f.case==FieldCase.UPPER){
          this.dataToSave += ',"'+f.name+'":"'+String(f.value).toUpperCase()+'"'
        }else if(f.case==FieldCase.LOWER){
          this.dataToSave += ',"'+f.name+'":"'+String(f.value).toLowerCase()+'"'
        }
        else{
          this.dataToSave += ',"'+f.name+'":"'+f.value+'"'
        }
      });
    });
    this.dataToSave += "}";

    this.objectToSave.emit(JSON.parse(this.dataToSave));
  }

  clearFields():void{
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
}
