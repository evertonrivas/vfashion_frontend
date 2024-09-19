import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';
import { Common } from 'src/app/classes/common';
import { SharedModule } from 'src/app/common/shared.module';
import { RequestResponse, ResponseError } from 'src/app/models/paginate.model';
import { ProductsService } from 'src/app/services/products.service';
import { FilterComponent } from "../../common/filter/filter.component";
import { FieldCase, FieldType, MassiveProductAction } from 'src/app/models/system.enum';
import { FieldOption, FormField, FormRow } from 'src/app/models/field.model';
import { B2bBrand, Color, Product, ProductCategory, ProductGrid, ProductModel, ProductType, Size } from 'src/app/models/product.model';
import { forkJoin } from 'rxjs';
import { BrandService } from 'src/app/services/brand.service';
import { ModelService } from 'src/app/services/model.service';
import { MomentService } from 'src/app/services/moment.service';
import { CategoryService } from 'src/app/services/category.service';
import { ColorService } from 'src/app/services/color.service';
import { SizeService } from 'src/app/services/size.service';
import { ProductTypeService } from 'src/app/services/product.type.service';
import { FormComponent } from 'src/app/common/form/form.component';
import { MeasureUnitService } from 'src/app/services/measure-unit.service';
import { MeasureUnit } from 'src/app/models/measure-unit';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpHeaders } from '@angular/common/http';
import { Moment } from 'src/app/models/moment.model';
import { DividerModule } from 'primeng/divider';

@Component({
    selector: 'app-products',
    standalone: true,
    providers: [
        MessageService,
        ConfirmationService
    ],
    templateUrl: './products.component.html',
    styleUrl: './products.component.scss',
    imports: [
        CommonModule,
        SharedModule,
        FilterComponent,
        FormComponent,
        FileUploadModule,
        DividerModule
    ]
})
export class ProductsComponent extends Common implements AfterViewInit {
  localObject!:Product;
  allOptType:FieldOption[]  = [];
  allOptModel:FieldOption[] = [];
  allOptGrid:FieldOption[]  = [];
  allOptMeasure:FieldOption[] = [];
  allOptCateg:FieldOption[] = []; 
  showDialogUpload:boolean = false;
  showDialogImport:boolean = false;
  url_upload_images:string = this.envconfig.backend_cmm+'/upload/products/';
  url_upload_import:string = this.envconfig.backend_cmm+'/upload/import/?type=P';
  uploadHeaders:HttpHeaders = new HttpHeaders()
    .set("Authorization",localStorage.getItem('token_type')+" "+localStorage.getItem('token_access'));
  
    //acoes massivas
  showMassive:boolean = false;
  selectedCategories:any;
  selectedType:any;
  selectedModel:any;
  selectedGrid:any;
  selectedMeasure:any;
  newPrice:any;
  actions = MassiveProductAction;
  selectedAction!:MassiveProductAction;

  constructor(route:Router,
    private msg:MessageService,
    private cnf:ConfirmationService,
    private svc:ProductsService,
    private cdr:ChangeDetectorRef,
    private svcB:BrandService,
    private svcM:ModelService,
    private svcMo:MomentService,
    private svcCt:CategoryService,
    private svcCo:ColorService,
    private svcS:SizeService,
    private svcT:ProductTypeService,
    private svcMU:MeasureUnitService
    ){
    super(route);
  }

  doFilter(query:string):void{
    this.options.query = query;
    this.loadingData();
  }

  ngAfterViewInit(): void {
    this.loadingData();
    this.loadingFilterData();

    const $pType   = this.svcT.list({page:1,pageSize:1,query:'can:list-all 1'});
    const $pModel  = this.svcM.list({page:1,pageSize:1,query:'can:list-all 1'});
    const $pGrid   = this.svc.listGrid({page:1,pageSize:1,query:'can:list-all 1'});
    const $pMeasure= this.svcMU.list({page:1,pageSize:1,query:'can:list-all 1'});
    const $pCateg  = this.svcCt.list({page:1,pageSize:1,query:'can:list-all 1'});

    this.serviceSub [1] = forkJoin([$pType,$pModel,$pGrid,$pMeasure,$pCateg]).subscribe(([valType,valModel,valGrid,valMeasure,valCateg]) =>{
      (valType as ProductType[]).forEach((t) =>{
        this.allOptType.push({value: t.id, label: t.name, id:undefined});
      });

      (valModel as ProductModel[]).forEach((m) =>{
        this.allOptModel.push({value: m.id, label: m.name, id:undefined});
      });

      (valGrid as ProductGrid[]).forEach((g) =>{
        this.allOptGrid.push({value:g.id, label:g.name, id:undefined});
      });

      (valMeasure as MeasureUnit[]).forEach((m) =>{
        this.allOptMeasure.push({value:m.id,label:m.code, id:undefined});
      });

      (valCateg as ProductCategory[]).forEach((c) =>{
        this.allOptCateg.push({value:c.id,label:c.name as string,id:undefined});
      });
    });



    this.cdr.detectChanges();
  }

  loadingData(evt:PaginatorState = { page: 0, pageCount: 0},pTrash:boolean = false):void{
    this.loading = true;
    this.options.page = ((evt.page as number)+1);

    //se nao existe trash no query
    if(this.options.query.indexOf("trash")==-1){
      this.options.query += (pTrash==true?"trash 1||":"");
    }else{
      if(pTrash==false){
        this.options.query = this.options.query.replace("trash 1||","");
      }
    }

    this.serviceSub[0] = this.svc.listProducts(this.options).subscribe({
      next: (data) =>{
        this.response = data as RequestResponse;
        this.cdr.detectChanges();
        this.loading = false;
      }
    });
  }

  loadingFilterData():void{
    this.filters.push({
      label:"Texto",
      placeholder: "Nome, Descrição, Observação, Código de Barras ou Referência...",
      name: "text",
      filter_name: "search",
      filter_prefix: "is",
      options:undefined,
      value:undefined,
      type: FieldType.INPUT
    });

    const $pBrand  = this.svcB.list({page:1,pageSize:1,query:'can:list-all 1'});
    const $pModel  = this.svcM.list({page:1,pageSize:1,query:'can:list-all 1'});
    const $pMoment = this.svcMo.list({page:1,pageSize:1,query:'can:list-all 1'});
    const $pCateg  = this.svcCt.list({page:1,pageSize:1,query:'can:list-all 1'});
    const $pType   = this.svcT.list({page:1,pageSize:1,query:'can:list-all 1'});

    this.serviceSub [1] = forkJoin([$pBrand,$pModel,$pMoment,$pCateg,$pType]).subscribe(([valBrand,valModel,valMoment,valCateg,valType]) =>{
      let optBrand:FieldOption[]  = [];
      let optModel:FieldOption[]  = [];
      let optMoment:FieldOption[] = [];
      let optCateg:FieldOption[]  = [];
      let optType:FieldOption[]   = [];
      
      (valBrand as B2bBrand[]).forEach((b) =>{
        optBrand.push({value: b.id, label: b.name as string, id:undefined});
      });

      (valModel as ProductModel[]).forEach((m) =>{
        optModel.push({value: m.id, label: m.name, id:undefined});
      });

      (valMoment as Moment[]).forEach((c) =>{
        optMoment.push({value: c.id, label: c.name, id:undefined});
      });

      (valCateg as ProductCategory[]).forEach((c) =>{
        optCateg.push({value: c.id, label: c.name as string, id:undefined});
      });

      (valType as ProductType[]).forEach((t) =>{
        optType.push({value: t.id, label: t.name, id:undefined});
      });

      this.filters.push({
        label:"Marca",
        placeholder:"Selecione...",
        name:"brand",
        filter_name:"brand",
        filter_prefix:"is",
        type: FieldType.MCOMBO,
        value:undefined,
        options: optBrand
      });

      this.filters.push({
        label:"Momento(s)/Coleção(ões)",
        placeholder:"Selecione...",
        name:"collection",
        filter_name:"collection",
        filter_prefix:"is",
        type:FieldType.MCOMBO,
        value:undefined,
        options:optMoment
      });

      this.filters.push({
        label:"Categoria(s)",
        placeholder:"Selecione...",
        name:"category",
        filter_name:"category",
        filter_prefix:"is",
        type:FieldType.MCOMBO,
        value:undefined,
        options:optCateg
      });

      this.filters.push({
        label: "Modelo",
        placeholder:"Selecione...",
        name:"model",
        filter_name:"model",
        filter_prefix:"is",
        type: FieldType.MCOMBO,
        value:undefined,
        options: optModel
      });

      this.filters.push({
        label: "Tipo",
        placeholder:"Selecione...",
        name:"type",
        filter_name:"type",
        filter_prefix:"is",
        type: FieldType.MCOMBO,
        value:undefined,
        options: optType
      });
    });
  }

  onEditData(id:number = 0):void{
    //limpa o formulario
    this.formRows = [];
    this.idToEdit = id;

    let fName:FormField = {
      label: "Nome",
      name: "name",
      options: undefined,
      placeholder: "Digite o nome...",
      type: FieldType.INPUT,
      value: undefined,
      required: true,
      case: FieldCase.UPPER,
      disabled: false,
      lockField: undefined
    };

    let fDesc:FormField = {
      label: "Descrição",
      name: "description",
      options: undefined,
      placeholder: "Digite a descrição...",
      type: FieldType.INPUT,
      value: undefined,
      case: FieldCase.NONE,
      disabled: false,
      required: false,
      lockField: undefined
    }

    let fCode:FormField = {
      label: "Código Original",
      name: "prod_code",
      options: undefined,
      placeholder: undefined,
      type: FieldType.INPUT,
      value: undefined,
      case:FieldCase.UPPER,
      disabled:false,
      required:true,
      lockField:undefined
    }

    let fBar:FormField = {
      label: "Código de Barras",
      name: "bar_code",
      options: undefined,
      placeholder: undefined,
      type: FieldType.BARCODE,
      value: undefined,
      case: FieldCase.NONE,
      disabled: false,
      required: false,
      lockField:undefined
    }

    let fRef:FormField = {
      label:"Referência",
      name: "ref_code",
      options: undefined,
      placeholder: undefined,
      type: FieldType.INPUT,
      value: undefined,
      case: FieldCase.NONE,
      disabled: false,
      required: true,
      lockField:undefined
    }

    let fPrice:FormField = {
      label: "Preço Atacado",
      name: "price",
      options: undefined,
      placeholder: undefined,
      type: FieldType.MONEY,
      value: undefined,
      case: FieldCase.NONE,
      disabled:false,
      required:true,
      lockField:undefined
    }

    let fPricePos:FormField = {
      label: "Preço Varejo",
      name: "price",
      options: undefined,
      placeholder: undefined,
      type: FieldType.MONEY,
      value: undefined,
      case: FieldCase.NONE,
      disabled:false,
      required:true,
      lockField:undefined
    }

    let fType:FormField = {
      label: 'Tipo de Produto',
      name: 'id_type',
      placeholder: "Selecione...",
      type: FieldType.COMBO,
      value: undefined,
      options: this.allOptType,
      required: true,
      case: FieldCase.NONE,
      disabled: false,
      lockField:undefined
    }

    let fModel:FormField = {
      label: 'Modelo',
      name: 'id_model',
      placeholder: "Selecione...",
      type: FieldType.COMBO,
      value: undefined,
      options: this.allOptModel,
      required: true,
      case: FieldCase.NONE,
      disabled: false,
      lockField:undefined
    }

    let fGrid:FormField = {
      label: 'Grade',
      name: 'id_grid',
      placeholder: "Selecione...",
      type: FieldType.COMBO,
      value: undefined,
      options: this.allOptGrid,
      required: true,
      case: FieldCase.NONE,
      disabled: false,
      lockField:undefined
    }

    let fMeasure:FormField = {
      label: 'UN. Medida',
      name: 'id_measure_unit',
      placeholder: "Selecione...",
      type: FieldType.COMBO,
      value: undefined,
      options: this.allOptMeasure,
      required: false, //tornado opcional em 18/09/2024
      case: FieldCase.NONE,
      disabled: false,
      lockField:undefined
    }

    let fObserve:FormField = {
      label: "Observações",
      name: "observation",
      placeholder: "Digite uma observação",
      type: FieldType.TEXT,
      value: undefined,
      options: undefined,
      required: false,
      case: FieldCase.NONE,
      disabled:false,
      lockField:undefined
    }

    let fOpts:FieldOption[] = [];
    for(let i=0;i<this.sysconfig.company_max_up_images;i++){
      fOpts.push({
        id:(i*-1),
        label:'',
        value:(i==0?true:false)
      });
    }
    let fImages:FormField = {
      label: "Imagens",
      name: "images",
      placeholder: "Digite ou cole a url da imagem",
      type: FieldType.IMGURL,
      value: undefined,
      options:fOpts,
      required: false,
      case: FieldCase.LOWER,
      disabled:false,
      lockField:undefined
    }
    // for(let i:number = 0;i<this.sysconfig.system.max_upload_images;i++){
      
    // }

    if(id>0){
      //busca os dados do registro para edicao
      this.serviceSub[2] = this.svc.load(id).subscribe({
        next: (data) =>{
          if ("name" in data){
            this.localObject = data as Product;
            fName.value    = this.localObject.name;
            fDesc.value    = this.localObject.description;
            fType.value    = fType.options?.find(v=> v.value==this.localObject.id_type);
            fGrid.value    = fGrid.options?.find(v=> v.value==this.localObject.id_grid);
            fModel.value   = fModel.options?.find(v => v.value==this.localObject.id_model);
            fMeasure.value = fMeasure.options?.find(v => v.value==this.localObject.id_measure_unit);
            fPrice.value   = this.localObject.price;
            fPricePos.value= this.localObject.price_pos;
            fBar.value     = this.localObject.barCode;
            fRef.value     = this.localObject.refCode;
            fCode.value    = this.localObject.prodCode;
            fDesc.value    = this.localObject.description;

            fImages.options = [];
            this.localObject.images.forEach(f =>{
              fImages.options?.push({
                id: f.id,
                label: f.img_url,
                value: f.default
              });
            });

            if (this.localObject.images.length < fOpts.length){
              for(let i=0;i<(fOpts.length - this.localObject.images.length);i++){
                fImages.options.push({
                  id: (i*-1),
                  value: false,
                  label:''
                });
              }
            }

            //monta as linhas do form e exibe o mesmo
            this.formRows.push({
              fields: [fName]
            });
            this.formRows.push({
              fields: [fDesc]
            });
            this.formRows.push({
              fields:[fCode,fRef,fBar,fPrice,fPricePos]
            });
            this.formRows.push({
              fields:[fType,fModel,fGrid,fMeasure]
            });
            this.formRows.push({
              fields:[fObserve]
            });
            if (this.sysconfig.company_use_url_images){
              this.formRows.push({
                fields:[fImages]
              });
            }
            this.formVisible = true;
            
          }else{
            this.msg.clear();
            this.msg.add({
              summary:"Falha...",
              detail: "Ocorreu um erro ao tentar carregar o registro",
              severity:"error"
            });
          }
        }
      });
    }else{
      //monta as linhas do form e exibe o mesmo
      this.formRows.push({
        fields: [fName]
      });
      this.formRows.push({
        fields: [fDesc]
      });
      this.formRows.push({
        fields:[fCode,fRef,fBar,fPrice,fPricePos]
      });
      this.formRows.push({
        fields:[fType,fModel,fGrid,fMeasure]
      });
      this.formRows.push({
        fields:[fObserve]
      });
      if (this.sysconfig.company_use_url_images){
        this.formRows.push({
          fields:[fImages]
        });
      }
      this.formVisible = true;
    }
  }

  onDataSave(data:any):void{
    this.hasSended = true;
    this.serviceSub[3] = this.svc.save(data).subscribe({
      next:(data) =>{
        this.hasSended = false;
        this.formVisible = false;
        this.msg.clear();
        if(typeof data ==='number'){

          //valida se precisa fazer upload de imagem ou se usa url
          if(!this.sysconfig.company_use_url_images){
            this.idToEdit = data as number;
            this.url_upload_images += this.idToEdit;
            this.showDialogUpload = true;
          }
          this.msg.add({
            summary:"Sucesso...",
            detail: "Registro criado com sucesso!",
            severity:"success"
          });
        }else if(typeof data ==='boolean'){
          //valida se precisa fazer upload de imagem ou se usa url
          if(!this.sysconfig.company_use_url_images){
            this.url_upload_images += this.idToEdit;
            this.showDialogUpload = true;
          }
          this.msg.add({
            summary:"Sucesso...",
            detail: "Registro atualizado com sucesso!",
            severity:"success"
          });
        }else{
          this.msg.add({
            summary:"Falha...",
            detail: "Ocorreu o seguinte erro: "+(data as ResponseError).error_details,
            severity:"error"
          });
        }
        this.loadingData();
      }
    });
  }

  onDataDelete(pSendToTrash:boolean):void{
    this.cnf.confirm({
      header:"Confirmação de "+(pSendToTrash==true?"exclusão":"restauração"),
      message:"Deseja realmente "+(pSendToTrash==true?"excluir":"restaurar")+" o(s) registro(s) marcado(s)?",
      acceptLabel:"Sim",
      acceptIcon:"pi pi-check mr-1",
      acceptButtonStyleClass:"p-button-sm",
      accept:() =>{
        let ids:number[] = [];
        this.tableSelected.forEach((v) =>{
          ids.push((v as Product).id);
        });
        this.serviceSub[3] = this.svc.delete(ids,pSendToTrash).subscribe({
          next: (data) =>{
            this.msg.clear();
            //carrega com base no botao de lixeira
            this.loadingData({page:0,pageCount:0},this.isTrash);
            //limpa os registros selecionados
            this.tableSelected = [];
            if (typeof data ==='boolean'){
              this.msg.add({
                severity:"success",
                summary:"Sucesso!",
                detail:"Registro(s) "+(pSendToTrash==true?"excluído":"restaurado")+"(s) com sucesso!"
              });
            }else{
              this.msg.add({
                summary:"Falha...",
                detail: "Ocorreu o seguinte erro: "+(data as ResponseError).error_details,
                severity:"error"
              });
            }
          }
        });
      },
      rejectLabel:"Não",
      rejectIcon:"pi pi-ban mr-1",
      rejectButtonStyleClass:"p-button-danger p-button-sm"
    });
  }

  cancelUpload(){
    
  }

  uploadDone(){

  }

  cancelImport(){
    this.showDialogImport = false;
  }

  onImport(){
    this.showDialogImport = true;
  }

  clearMassive(){
    this.selectedCategories = undefined;
    this.selectedGrid = undefined;
    this.selectedMeasure = undefined;
    this.selectedModel = undefined;
    this.selectedType = undefined;
    this.newPrice = undefined;
  }

  executeMassive(act:MassiveProductAction){
    this.hasSendMassive = true;
    this.selectedAction = act;
    this.msg.clear();
    let selection:any;
    switch(act){
      case this.actions.CATEGORY: 
        if(this.selectedCategories==undefined){
          return;
        }else{
          selection = this.selectedCategories;
        }
      break;
      case this.actions.GRID: 
        if(this.selectedGrid==undefined){
          return;
        }else{
          selection = this.selectedGrid
        }
      break;
      case this.actions.MEASURE: 
        if(this.selectedMeasure==undefined){
          return;
        }else{
          selection = this.selectedMeasure;
        }
      break;
      case this.actions.MODEL: 
        if(this.selectedModel==undefined){
          return;
        }else{
          selection = this.selectedModel;
        }
      break;
      case this.actions.PRICE: 
        if(this.newPrice==undefined){
          return;
        }else{
          selection = this.newPrice;
        }
      break;
      case this.actions.TYPE:
        if(this.selectedType==undefined){
          return;
        }else{
          selection = this.selectedType;
        }
      break;
    }

    let ids:number[] = [];
    this.tableSelected.forEach(p =>{
      ids.push(p.id);
    });

    this.svc.executeMassive(this.selectedAction,ids,selection).subscribe({
      next:(data) =>{
        if(typeof data ==='boolean'){
          this.msg.add({
            severity:"success",
            summary:"Sucesso!",
            detail:"Ação massiva executada com sucesso!"
          });
          this.loadingData();
        }else{
          this.msg.add({
            summary:"Falha...",
            detail: "Ocorreu o seguinte erro: "+(data as ResponseError).error_details,
            severity:"error"
          });
        }
      }
    });
  }
}
