import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedModule } from '../shared.module';
import { CommonModule } from '@angular/common';
import { FieldCase, FieldType } from 'src/app/models/system.enum';
import { FieldOption, FormField, FormRow } from 'src/app/models/field.model';
import { ColorPickerModule } from 'primeng/colorpicker';
import { PasswordModule } from 'primeng/password';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { HttpHeaders } from '@angular/common/http';
import { provideNgxMask } from 'ngx-mask';
import { SysService } from 'src/app/services/sys.service';
import { Cep } from 'src/app/models/entity.model';

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
  styleUrl: './form.component.scss',
  providers:[provideNgxMask()]
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
  icons:string[] = [];
  loadingPC:boolean = false;
  uploadHeaders:HttpHeaders = new HttpHeaders()
    .set("Authorization",localStorage.getItem('token_type')+" "+localStorage.getItem('token_access'));

  constructor(private sys:SysService){
    //icones
    this.icons.push("list_alt");
    this.icons.push("phone_disabled");
    this.icons.push("support_agent");
    this.icons.push("event");
    this.icons.push("order_approve");
    this.icons.push("verified");
    this.icons.push("home");
    this.icons.push("token");
    this.icons.push("heart_plus");
    this.icons.push("person");
    this.icons.push("group");
    this.icons.push("thumb_up");
    this.icons.push("groups");
    this.icons.push("public");
    this.icons.push("face");
    this.icons.push("rocket_launch");
    this.icons.push("workspace_premium");
    this.icons.push("emoji_objects");
    this.icons.push("eco");
    this.icons.push("pets");
    this.icons.push("military_tech");
    this.icons.push("thumb_down");
    this.icons.push("diversity_1");
    this.icons.push("vaccines");
    this.icons.push("psychology_alt");
    this.icons.push("cruelty_free");
    this.icons.push("medical_information");
    this.icons.push("potted_plant");
    this.icons.push("rainy");
    this.icons.push("cookie");
    this.icons.push("communication");
    this.icons.push("male");
    this.icons.push("clear_day");
    this.icons.push("wind_power");
    this.icons.push("stars");
    this.icons.push("hotel_class");
    this.icons.push("component_exchange");
    this.icons.push("notifications");
    this.icons.push("chat");
    this.icons.push("alternate_email");
    this.icons.push("call");
    this.icons.push("mail");
    this.icons.push("photo_camera");
    this.icons.push("palette");
    this.icons.push("payments");
    this.icons.push("credit_card");
    this.icons.push("paid");
    this.icons.push("savings");
    this.icons.push("shoppingmode");
    this.icons.push("location_on");
    this.icons.push("restaurant");
    this.icons.push("handyman");
    this.icons.push("home_work");
    this.icons.push("local_florist");
    this.icons.push("church");
    this.icons.push("local_shipping");
    this.icons.push("train");
    this.icons.push("local_taxi");
    this.icons.push("sailing");
    this.icons.push("snowmobile");
    this.icons.push("school");
    this.icons.push("volunteer_activism");
    this.icons.push("sports_esports");
    this.icons.push("self_improvement");
    this.icons.push("sports_soccer");
    this.icons.push("hiking");
    this.icons.push("architecture");
    this.icons.push("surfing");
    this.icons.push("skateboarding");
    this.icons.push("kayaking");

    this.kcolors.push({
      value: '0',
      label: 'Pastel Rainbow',
      items: [
          { value: '#BAE1FF', label: '#BAE1FF' }, //azul
          { value: '#BAFFC9', label: '#BAFFC9' }, //verde
          { value: '#FFFFBA', label: '#FFFFBA' }, //amarelo
          { value: '#FFDFBA', label: '#FFDFBA' }, //laranja
          { value: '#FFB3DA', label: '#FFB3DA' } //vermelho
      ]
    });
    this.kcolors.push({
        value: '1',
        label: 'WarmPastel',
        items:[
            { value:'#F3EFDA', label: '#F3EFDA' }, //#f3efda
            { value:'#F8EECE', label: '#F8EECE' }, //#f8eece
            { value:'#F3E5DA', label: '#F3E5DA' }, //#f3e5da
            { value:'#F3DADA', label: '#F3DADA' }, //#f3dada
            { value:'#F3F1DA', label: '#F3F1DA' } //#f3f1da
        ]
    });
    this.kcolors.push({
        value: '2',
        label: 'SetsunaLight',
        items: [
            { value: '#B8E4F8', label: '#B8E4F8' }, //#b8e4f8
            { value: '#B8DDF8', label: '#B8DDF8' }, //#b8ddf8
            { value: '#C3F8F8', label: '#C3F8F8' }, //#c3b8f8
            { value: '#D5B8F8', label: '#D5B8F8' }, //#d5b8f8
            { value: '#EAF5FA', label: '#EAF5FA' }, //#eaf5fa
        ]
    });
    this.kcolors.push({
        value: '3',
        label:'Watermelon',
        items: [
            { value: '#A8E6CF', label: '#A8E6CF' }, //#a8e6cf
            { value: '#DCEDC1', label: '#DCEDC1' }, //#dcedc1
            { value: '#FFD3B6', label: '#FFD3B6' }, //#ffd3b6
            { value: '#FFAAA5', label: '#FFAAA5' }, //#ffaaa5
            { value: '#FF8B94', label: '#FF8B94' }, //#ff8b94
        ]
    });
  } 

  onDateChanged():void{

  }

  onChangeLock(evt:EventEmitter<any>, field:FormField, value:any):void{
    // console.log(evt);
    if(evt==value){
      field.disabled = true;
      field.value = undefined;
    }else{
      field.disabled = false;
    }
  }

  doSave():void{
    this.sended = true;

    // this.rows.forEach((r) =>{
    //   r.fields.forEach((f) =>{
    //     if(f.type==this.fieldType.KCOLOR){
    //       console.log(f.value);
    //     }
    //   });
    // });

    if(this.isValidated()){
      this.visible = false;
      this.visibleChange.emit(this.visible);

      let value:string|undefined = undefined;

      this.dataToSave = '{"id":"'+this.registryId.toString()+'"';
      this.rows.forEach((r) =>{
        r.fields.forEach((f) =>{
          if (f.type==this.fieldType.COMBO || f.type==this.fieldType.KCOLOR ){
            value = f.value!=undefined?f.value.value:undefined
          }else if(f.type==this.fieldType.PASSWD){
            value = f.value[0];
          }else if(f.type==this.fieldType.MCOMBO){
            value = "["+f.value+"]"
          }else if(f.type==this.fieldType.IMGURL){
            let images:string[] = [];
            f.options?.forEach(o =>{
              images.push('{ "id":'+o.id+',"url":"'+o.label+'","default": '+o.value+' }');
            });
            value = "["+images.join(",")+"]";
          }else{
            value = f.value!=undefined?f.value:undefined
          }
          if (f.case==FieldCase.UPPER){
            this.dataToSave += ',"'+f.name+'":'+(value==undefined?null:((f.type!=this.fieldType.IMGURL && f.type!=this.fieldType.MCOMBO)?'"'+value?.toString().toUpperCase()+'"':value))
          }else if(f.case==FieldCase.LOWER){
            this.dataToSave += ',"'+f.name+'":'+(value==undefined?null:((f.type!=this.fieldType.IMGURL && f.type!=this.fieldType.MCOMBO)?'"'+value?.toString().toLowerCase()+'"':value))
          }
          else{
            this.dataToSave += ',"'+f.name+'":'+(value==undefined?null:((f.type!=this.fieldType.IMGURL && f.type!=this.fieldType.MCOMBO)?'"'+value?.toString()+'"':value))
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

  setIcon(icon:any,field:FormField):void{
    field.value = icon;
  }

  getPostalCode(evt:EventEmitter<any>,dependents?:FormField[]){
    if(evt.length==8){
      this.loadingPC = true;
      this.sys.getPostalCode(evt.toString()).subscribe({
        next: (data) =>{
          this.loadingPC = false;
          if("address" in data){
            dependents?.forEach(d =>{
              if(d.name=="address"){
                d.value = (data as Cep).address;
              }
              if(d.name=="neighborhood"){
                d.value = (data as Cep).neighborhood;
              }
              if(d.name=="city"){
                d.value = d.options?.find(f => f.id == (data as Cep).id_city);
              }
            })
            // this.editableCustomer.address = (data as Cep).address,
            // this.editableCustomer.neighborhood = (data as Cep).neighborhood,
            // this.editableCustomer.city = this.citySuggestions.find(v => v.id == (data as Cep).id_city) as City;
          }else{
            // this.messageToShow.emit({
            //   key:'systemToast',
            //   severity:'error',
            //   summary:'Falha...',
            //   detail: (data as ResponseError).error_details
            // });
          }
        }
      });
    }
  }
}
