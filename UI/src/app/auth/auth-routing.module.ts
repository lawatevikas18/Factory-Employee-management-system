import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { OptComponent } from './opt/opt.component';
import { AddUserComponent } from '../component/add-user/add-user.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'otp', component: OptComponent },
  { path: 'adduser', component:  AddUserComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
