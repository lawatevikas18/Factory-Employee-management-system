import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { AuthRoutingModule } from './auth-routing.module';
import { OptComponent } from './opt/opt.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [LoginComponent, OptComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    TranslateModule,
     FormsModule,
    ReactiveFormsModule,
    
  ]
})
export class AuthModule { }
