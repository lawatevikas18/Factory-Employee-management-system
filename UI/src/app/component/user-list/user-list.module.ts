import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserListComponent } from './user-list.component';
import { UserListRoutingModule } from './user-list-routing.module';

@NgModule({
  declarations: [UserListComponent],
  imports: [
    CommonModule,
    FormsModule,
    UserListRoutingModule,
    HttpClientModule
  ],
  exports: [UserListComponent] // ✅ allows you to use <app-user-list> anywhere
})
export class UserListModule {}
