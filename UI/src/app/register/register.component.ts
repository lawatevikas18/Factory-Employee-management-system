import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
   users: any[] = [];
  loading = true;
  editMode = false;
  selectedUser: any = null;
  userForm!: FormGroup;
  previewImage?: string;
  selectedImage?: File;
  photoUrl = environment.photoUrl;

  constructor(private userService: AuthService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (res:any) => {
        console.log("Users",res)
        this.users = res.users;
        this.loading = false;
      },
      
      error: (err) => {
         console.log("Users",err)
         this.loading = false
        }
    });
  }

  startEdit(user: any) {
    this.selectedUser = user;
    this.editMode = true;
    this.userForm = this.fb.group({
      name: [user.name, Validators.required],
      address: [user.address],
      aadhaar: [user.aadhaar],
      panCard: [user.panCard],
      mobileNumber: [user.mobileNumber, Validators.required],
      role: [user.role, Validators.required],
      factoryName: [user.factoryName],
      password: ['']
    });
    this.previewImage = environment.photoUrl + user.imagePath;
    console.log("Selected User Image:", this.previewImage);
  }

  cancelEdit() {
    this.editMode = false;
    this.selectedUser = null;
    this.userForm.reset();
    this.previewImage = undefined;
  }

  onFileChange(event: any) {
    this.selectedImage = event.target.files[0];
     if (!this.selectedImage) return;
    const reader = new FileReader();
    reader.onload = (e) => (this.previewImage = e.target?.result as string);
    reader.readAsDataURL(this.selectedImage);
  }
 

  updateUser() {
    if (!this.selectedUser) return;

    const formData = new FormData();
    Object.keys(this.userForm.value).forEach(key => {
      formData.append(key, this.userForm.value[key]);
    });
    if (this.selectedImage) formData.append('image', this.selectedImage);

    this.userService.updateUser(this.selectedUser.userId, formData).subscribe({
      next: () => {
        alert('✅ User updated successfully!');
        this.loadUsers();
        this.cancelEdit();
      },
      error: (err) => {
        alert('❌ Error updating user: ' + (err.error?.error || err.message));
      }
    });
  }
}
