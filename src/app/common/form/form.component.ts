import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedModule } from '../shared.module';
import { CommonModule } from '@angular/common';
import { FieldCase, FieldType } from 'src/app/models/system.enum';
import { FieldOption, FormRow } from 'src/app/models/field.model';
import { ColorPickerModule } from 'primeng/colorpicker';
import { PasswordModule } from 'primeng/password';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    PasswordModule,
    ColorPickerModule,
    IconFieldModule,
    InputIconModule,
    InputTextareaModule
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
  selectedImageOption:any;
  kcolors:any[] = [];
  uploadHeaders:HttpHeaders = new HttpHeaders()
    .set("Authorization",localStorage.getItem('token_type')+" "+localStorage.getItem('token_access'));

  constructor(){
    this.kcolors.push({
      value: '0',
      label: 'Pastel Rainbow',
      items: [
          { value: '#BAE1FF', label: '#BAE1FF'}, //azul
          { value: '#BAFFC9', label: '#BAFFC9'}, //verde
          { value: '#FFFFBA', label: '#FFFFBA'}, //amarelo
          { value: '#FFDFBA', label: '#FFDFBA'}, //laranja
          { value: '#FFB3DA', label: '#FFB3DA'} //vermelho
      ]
    });
    this.kcolors.push({
        value: '1',
        label: 'WarmPastel',
        items:[
            { value:'#F3EFDA', label: '#F3EFDA'}, //#f3efda
            { value:'#F8EECE', label: '#F8EECE'}, //#f8eece
            { value:'#F3E5DA', label: '#F3E5DA'}, //#f3e5da
            { value:'#F3DADA', label: '#F3DADA'}, //#f3dada
            { value:'#F3F1DA', label: '#F3F1DA'} //#f3f1da
        ]
    });
    this.kcolors.push({
        value: '2',
        label: 'SetsunaLight',
        items: [
            { value: '#B8E4F8', label: '#B8E4F8'}, //#b8e4f8
            { value: '#B8DDF8', label: '#B8DDF8'}, //#b8ddf8
            { value: '#C3F8F8', label: '#C3F8F8'}, //#c3b8f8
            { value: '#D5B8F8', label: '#D5B8F8'}, //#d5b8f8
            { value: '#EAF5FA', label: '#EAF5FA'}, //#eaf5fa
        ]
    });
    this.kcolors.push({
        value: '3',
        label:'Watermelon',
        items: [
            { value: '#A8E6CF', label: '#A8E6CF'}, //#a8e6cf
            { value: '#DCEDC1', label: '#DCEDC1'}, //#dcedc1
            { value: '#FFD3B6', label: '#FFD3B6'}, //#ffd3b6
            { value: '#FFAAA5', label: '#FFAAA5'}, //#ffaaa5
            { value: '#FF8B94', label: '#FF8B94'}, //#ff8b94
        ]
    });
  } 

  onDateChanged():void{

  }

  doSave():void{
    this.sended = true;

    this.rows.forEach((r) =>{
      r.fields.forEach((f) =>{
        if(f.type==this.fieldType.KCOLOR){
          console.log(f.value);
        }
      });
    });

    if(this.isValidated()){
      this.visible = false;
      this.visibleChange.emit(this.visible);

      let value:string|undefined = undefined;

      this.dataToSave = '{"id":"'+this.registryId.toString()+'"';
      this.rows.forEach((r) =>{
        r.fields.forEach((f) =>{
          if (f.type==this.fieldType.COMBO || f.type==this.fieldType.KCOLOR){
            value = f.value.value!=undefined?f.value.value:undefined
          }else if(f.type==this.fieldType.PASSWD){
            value = f.value[0]
          }else{
            value = f.value!=undefined?f.value:undefined
          }
          if (f.case==FieldCase.UPPER){
            this.dataToSave += ',"'+f.name+'":'+(value!=undefined?'"'+value?.toString().toUpperCase()+'"':null)
          }else if(f.case==FieldCase.LOWER){
            this.dataToSave += ',"'+f.name+'":'+(value!=undefined?'"'+value?.toString().toLowerCase()+'"':null)
          }
          else{
            this.dataToSave += ',"'+f.name+'":'+(value!=undefined?'"'+value.toString()+'"':null)
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

  setOnlyCheckbox(optId:number|undefined,options:FieldOption[]|undefined){
    options?.forEach((o) =>{
      if(o.id==optId){
        o.value = true;
      }else{
        o.value = false;
      }
    });
  }
}
