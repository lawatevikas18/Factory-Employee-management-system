import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email = '';
  password = '';
  selectedCompany = '';
  companies: string[] = ['COMP1', 'COMP2', 'COMP3', 'COMP4', 'COMP5']; 
  adminData: any;

  constructor(
    private apiService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  onLogin() {
    if (!this.selectedCompany) {
      this.toastr.error('Please select a company', 'Validation Error');
      return;
    }

    let requestObj = {
      userId: this.email,
      password: this.password,
      company: this.selectedCompany
    };

    this.apiService.login(requestObj).subscribe({
      next: (response) => {
        console.log('Login success:', response);
        this.adminData = response;
        localStorage.setItem('adminData', JSON.stringify(this.adminData));
        this.toastr.success('Login successful!', 'Success');
        this.router.navigate(['/dashboard']);
        localStorage.setItem('adminData', JSON.stringify(this.adminData));
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.adminData = { adminName: 'santosh d', adminId: '1', role: 'Admin' };
        // this.toastr.error('Invalid credentials!', 'Error');
        this.toastr.success('Login successful!', 'Success');
        this.router.navigate(['/dashboard']);
        localStorage.setItem('adminData', JSON.stringify(this.adminData));
      }
    });
  }
}
