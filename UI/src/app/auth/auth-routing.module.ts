import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { OptComponent } from './opt/opt.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'otp', component: OptComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
