import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth.service';
import { ErrorPopUpService } from 'src/app/core/services/error-pop-up.service';
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
      isLoginMode = true; // toggle between login and register
  loginForm: FormGroup;
  registerForm: FormGroup;
  message: string = '';
  showPassword: boolean = false;

  constructor(private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router,
    private loader: LoaderService,
    private error:ErrorPopUpService
  ) {
    this.loginForm = this.fb.group({
      mobileNumber: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registerForm = this.fb.group({
      adminId: ['', Validators.required],
      name: ['', Validators.required],
      address: ['', Validators.required],
      aadhaar: ['', Validators.required],
      panCard: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      role: ['', Validators.required],
      factoryName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.message = '';
  }

  login() {
    
    if (this.loginForm.valid) {
      this.loader.show()
      this.authService.login(this.loginForm.value).subscribe({
        next: res => {
          sessionStorage.setItem('token', res.token);
          this.message = 'Login successful!';
          this.loader.hide()
           this.router.navigate(['/dashboard']);
        },
        error: (err) => {
        this.loader.hide();
        this.error.showError(`login Failed:${err?.error}`)
        console.error('login Failed', err);
      },
      complete: () => {
        this.loader.hide(); 
      }
      });
    }
  }

  register() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: res => {
          this.message = res.message;
          this.registerForm.reset();
          this.isLoginMode = true;
        },
        error: err => this.message = err.error || 'Registration failed!'
      });
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

}
