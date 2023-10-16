import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private menuOpen = new Subject<any>();
  private cartOpen = new Subject<any>();

  menuOpen$ = this.menuOpen.asObservable();
  cartOpen$ = this.cartOpen.asObservable();

  staticMenuDesktopInactive:boolean = false;
  constructor() { }

  onMenuToggle(){
    this.staticMenuDesktopInactive = !this.staticMenuDesktopInactive;
    this.menuOpen.next(null);
  }

  onCartToggle(){
    this.cartOpen.next(null);
  }
}
