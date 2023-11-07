import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Common } from '../classes/common';
import { Router } from '@angular/router';
import { LayoutService } from '../services/layout.service';
import { FilterService as SysFilter } from '../services/filter.service';
import { forkJoin } from 'rxjs';
import { B2bBrand, Color, ProductCategory, ProductCollection, ProductModel, ProductType, Size } from '../models/product.model';
import { Options } from '../models/paginate.model';
import { Filter } from '../models/filter.model';

@Component({
  selector: 'app-salesforce',
  templateUrl: './salesforce.component.html',
  styleUrls: ['./salesforce.component.scss']
})
export class SalesforceComponent extends Common implements OnInit{
  @Output() filteredEvent = new EventEmitter<Filter>();
  sidebarVisible:boolean = false;
  sidebarCart:boolean = false;
  all_brand:B2bBrand[] = [];
  all_collect:ProductCollection[] = [];
  all_categ:ProductCategory[] = [];
  all_type:ProductType[] = [];
  all_model:ProductModel[] = [];
  all_size:Size[] = [];
  all_color:Color[] = [];

  optBrand:Options = {page:1, pageSize:1, query:'can:list-all 1||is:order-by name||is:order asc' }
  optCollect:Options = {page:1, pageSize:1, query:'can:list-all 1||is:order-by name||is:order asc' }
  optCateg:Options = {page:1, pageSize:1, query:'can:list-all 1||is:order-by name||is:order asc'}
  optType:Options = {page:1, pageSize:1, query:'can:list-all 1||is:order-by name||is:order asc'}
  optModel:Options = {page:1, pageSize:1, query:'can:list-all 1||is:order-by name||is:order asc'}
  optSize:Options = {page:1, pageSize:1, query:'can:list-all 1||is:order-by id||is:order asc'}
  optColor:Options = {page:1, pageSize:1, query:'can:list-all 1||is:order-by name||is:order asc'}

  filter:Filter = {
    brands: [],
    models: [],
    categories: [],
    types: [],
    collections: [],
    colors: [],
    sizes: [],
    query: ''
  }
 
  constructor(router:Router,
    private svcLay:LayoutService,
    private svcFil:SysFilter,
    ){
    super(router);
  }

  ngOnInit(): void {
    this.svcLay.menuOpen$.subscribe({
      next: () =>{
          this.sidebarVisible = !this.sidebarVisible;
      }
    });

    this.svcLay.cartOpen$.subscribe({
      next: () =>{
        this.sidebarCart = !this.sidebarCart;
      }
    });

    this.loadFilter();
    this.route.navigate(['/salesforce/grid']);
  }

  loadFilter():void{
    const $brand   = this.svcFil.listBrand(this.optBrand);
    const $collect = this.svcFil.listCollection(this.optCollect);
    const $categ   = this.svcFil.listCategory(this.optCateg);
    const $type    = this.svcFil.listType(this.optType);
    const $model   = this.svcFil.listModel(this.optModel);
    const $size    = this.svcFil.listSize(this.optSize);
    const $color   = this.svcFil.listColor(this.optColor);

    this.serviceSub[0] = forkJoin([$brand,$collect,$categ,$type,$model,$size,$color])
    .subscribe({
      next:([brand,collect,categ,type,model,size,color])=>{
        this.all_brand   = brand as B2bBrand[];
        this.all_collect = collect as ProductCollection[];
        this.all_categ   = categ as ProductCategory[]; 
        this.all_type    = type as ProductType[];
        this.all_model   = model as ProductModel[];
        this.all_size    = size as Size[];
        this.all_color   = color as Color[];
      }
    });
  }

  doFilter():void{
    this.route.navigate(["/salesforce/grid"]).finally(() =>{
      this.filteredEvent.emit();
      this.svcFil.announceFilter(this.filter);
      this.sidebarVisible = false;
    });
  }
  
}
