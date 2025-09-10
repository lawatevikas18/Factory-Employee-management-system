import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutRoutingModule } from './layout-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './header/header.component';
import { FormsModule } from '@angular/forms';
import { BodyComponent } from './body/body.component';





@NgModule({
  declarations: [SidebarComponent,LayoutComponent,HeaderComponent, BodyComponent],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    TranslateModule,
    FormsModule
  ]
})
export class LayoutModule { }
