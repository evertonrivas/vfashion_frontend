import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedModule } from '../shared.module';
import { CommonModule } from '@angular/common';
import { FieldCase, FieldType } from 'src/app/models/system.enum';
import { FormField, FormRow } from 'src/app/models/field.model';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    PasswordModule
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
  sended:boolean = false;

  constructor(){

  }

  onDateChanged():void{

  }

  doSave():void{
    this.sended = true;

    if(this.isValidated()){
      this.visible = false;
      this.visibleChange.emit(this.visible);

      this.dataToSave = '{"id":"'+this.registryId.toString()+'"';
      this.rows.forEach((r) =>{
        r.fields.forEach((f) =>{
          if (f.case==FieldCase.UPPER){
            this.dataToSave += ',"'+f.name+'":"'+String(f.type==FieldType.COMBO?f.value.value:((f.type==FieldType.PASSWD?f.value[0]:f.value))).toUpperCase()+'"'
          }else if(f.case==FieldCase.LOWER){
            this.dataToSave += ',"'+f.name+'":"'+String(f.type==FieldType.COMBO?f.value.value:((f.type==FieldType.PASSWD?f.value[0]:f.value))).toLowerCase()+'"'
          }
          else{
            this.dataToSave += ',"'+f.name+'":"'+(f.type==FieldType.COMBO?f.value.value:((f.type==FieldType.PASSWD?f.value[0]:f.value)))+'"'
          }
        });
      });
      this.dataToSave += "}";

      this.objectToSave.emit(JSON.parse(this.dataToSave));
    }
  }

  private isValidated():any{
    for(var i=0;i<this.rows.length;i++){
      for(var f=0;f<this.rows[i].fields.length;f++){
        if(this.rows[i].fields[f].required==true && this.rows[i].fields[f].value==undefined && this.rows[i].fields[f].type!=this.fieldType.PASSWD){
          return false;
        }else if(this.rows[i].fields[f].type==FieldType.PASSWD){
          if(this.rows[i].fields[f].required==true && (this.rows[i].fields[f].value[0]==undefined || this.rows[i].fields[f].value[1]==undefined) || (this.rows[i].fields[f].value[0]!=this.rows[i].fields[f].value[1])){
            return false;
          }
        }
      }
    }
    return true;
  }

  clearFields():void{
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
}
