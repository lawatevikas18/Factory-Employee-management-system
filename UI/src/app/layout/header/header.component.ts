// src/app/layout/header/header.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

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
    sessionStorage.removeItem('adminData');
  sessionStorage.clear();
    // window.location.href = '/login';
     this.router.navigate(['/login'])
  }

  toggleSettingsPopup() {
    this.showSettingsPopup = !this.showSettingsPopup;
  }
}
