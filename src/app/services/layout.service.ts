import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private menuOpen = new Subject<any>();

  menuOpen$ = this.menuOpen.asObservable();

  staticMenuDesktopInactive:boolean = false;
  constructor() { }

  onMenuToggle(){
    this.staticMenuDesktopInactive = !this.staticMenuDesktopInactive;
    this.menuOpen.next(null);
  }
}
