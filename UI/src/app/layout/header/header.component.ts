// src/app/layout/header/header.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  languages = [
    { code: 'en', label: 'English' },
    { code: 'mr', label: 'मराठी' },
    { code: 'kn', label: 'ಕನ್ನಡ' }
  ];

  showSettingsPopup = false;

  constructor(private translate: TranslateService,
    private router:Router
  ) {}

  changeLanguage(lang: string) {
    this.translate.use(lang);
    this.showSettingsPopup = false; // close popup on change
  }

  logout() {
 Swal.fire({
      title: 'Are you sure?',
      text: 'You want to logout!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#7f8c8d',
      confirmButtonText: 'Yes,  logout!'
    }).then((result) => {
      if (result.isConfirmed) {
           sessionStorage.removeItem('adminData');
           sessionStorage.clear();
            sessionStorage.clear();
     this.router.navigate(['/login'])
      }
    });
  } 

  toggleSettingsPopup() {
    this.showSettingsPopup = !this.showSettingsPopup;
  }
}
