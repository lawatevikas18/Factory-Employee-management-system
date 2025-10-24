import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

userForm!: FormGroup;
  selectedImage: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  isSubmitting = false;
  appurl=`${environment.apiUrl}/register`

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      adminId: ['', Validators.required],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      address: [''],
      aadhaar: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],
      panCard: ['', [Validators.pattern(/^[A-Z]{5}\d{4}[A-Z]{1}$/)]],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      role: ['', Validators.required],
      factoryName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      image: [null]
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
    console.log(this.userForm.invalid)
    if (!this.userForm.invalid) return ;

    const formData = new FormData();
    Object.entries(this.userForm.value).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value as string);
      }
    });
    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    this.isSubmitting = true;
    this.http.post(this.appurl, formData).subscribe({
      next: (res: any) => {
        alert('✅ User added successfully!');
        this.userForm.reset();
        this.previewUrl = null;
        this.isSubmitting = false;
        this.router.navigate(['/user-list']);
      },
      error: (err) => {
        alert('❌ ' + (err.error?.message || 'Something went wrong'));
        this.isSubmitting = false;
      }
    });
  }

}
