import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CoreModule } from './core/core.module';
import { LayoutModule } from './layout/layout.module';
import { EmployeeDetailsModule } from './component/employee-details/employee-details.module';
import { ToastrModule } from 'ngx-toastr';
import { ReportsModule } from './component/reports/reports.module';
import { AuthModule } from './auth/auth.module';
import { LoaderComponent } from './layout/loader/loader.component';
import { ErrorPopUpComponent } from './layout/error-pop-up/error-pop-up.component';
import { InviceModule } from './component/invice/invice.module';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    LoaderComponent,
    ErrorPopUpComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      defaultLanguage: 'en'
    }),
    CoreModule,
    LayoutModule,
    EmployeeDetailsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-center', // top-center
      closeButton: false,                // no close button
      timeOut: 3000,
      progressBar: true,
      progressAnimation: 'increasing',
      preventDuplicates: true,
      toastClass: 'ngx-toastr toast-top-custom' // custom width/height
    }),
     ReportsModule,
     AuthModule,
     InviceModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
