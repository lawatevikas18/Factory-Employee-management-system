import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-opt',
  templateUrl: './opt.component.html',
  styleUrls: ['./opt.component.scss']
})
export class OptComponent {
otp: string[] = ['', '', '', ''];

  constructor(private auth: AuthService, private router: Router) {}

  onVerifyOtp() {
    const enteredOtp = this.otp.join('');
    if (enteredOtp === '1234') { 
      this.auth.login('real-jwt-token');
      this.router.navigate(['/dashboard']);
    }
  }

  resendOtp(event: Event) {
    event.preventDefault();
    alert('OTP resent!');
  }
}
