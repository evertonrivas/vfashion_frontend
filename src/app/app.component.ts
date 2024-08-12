import { Component, OnInit, isDevMode } from '@angular/core';
import { SysService } from './services/sys.service';
import { SysConfig } from './models/auth.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'nfrontend';

  ngOnInit(): void {
    
  }
}
