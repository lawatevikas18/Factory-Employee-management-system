import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardRoutingModule } from '../dashboard-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { UploadComponent } from './upload/upload.component';



@NgModule({
  declarations: [
    DashboardComponent,
    UploadComponent,
    UploadComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    TranslateModule,
    
  ]
})
export class DashboardModule { }
