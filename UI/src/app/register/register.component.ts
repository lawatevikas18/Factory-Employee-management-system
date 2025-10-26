import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  userForm!: FormGroup;
  selectedImage: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  isSubmitting = false;
  message: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      Name: ['', [Validators.required, Validators.maxLength(100)]],
      Address: [''],
      Aadhaar: [''],
      PanCard: [''],
      MobileNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      Role: ['', Validators.required],
      FactoryName: ['', Validators.required],
      Password: ['', [Validators.required, Validators.minLength(6)]],
      Image: [null]
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = () => (this.previewUrl = reader.result);
      reader.readAsDataURL(file);
    }
  }

  submitForm(): void {
    if (this.userForm.invalid) return;

    const formData = new FormData();
    Object.entries(this.userForm.value).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value as string);
      }
    });
    if (this.selectedImage) {
      formData.append('Image', this.selectedImage);
    }

    this.isSubmitting = true;
    this.message = null;

    this.authService.register(formData).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        this.message = res.message || 'User registered successfully!';
        this.userForm.reset();
        this.previewUrl = null;
      },
      error: (err: any) => {
        this.isSubmitting = false;
        this.message = err.error?.error || 'Registration failed!';
      }
    });
  }
}
