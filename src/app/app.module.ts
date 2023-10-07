import { NgModule } from '@angular/core';
import { DATE_PIPE_DEFAULT_OPTIONS, HashLocationStrategy, LocationStrategy, registerLocaleData } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LOCALE_ID,DEFAULT_CURRENCY_CODE } from '@angular/core';
import * as sys_config from 'src/assets/config.json';
import ptBr from '@angular/common/locales/pt';

registerLocaleData(ptBr)

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [{
    provide: LocationStrategy, 
    useClass: HashLocationStrategy
  },
  {
    provide: LOCALE_ID,
    useValue: ((sys_config as any).default).locale.language
  },{
    provide: DEFAULT_CURRENCY_CODE,
    useValue: ((sys_config as any).default).locale.currency_code
  },{
    provide: DATE_PIPE_DEFAULT_OPTIONS,
    useValue:{
      dateFormat: ((sys_config as any).default).locale.date_format,
      timezone: ((sys_config as any).default).locale.timezone
    }
  }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
