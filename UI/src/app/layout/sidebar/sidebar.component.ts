import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { navbardata } from './nav-data';

interface SideNavToggle {
  screenwidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})


export class SidebarComponent implements OnInit {
  @Output() onToggelSideNav: EventEmitter<SideNavToggle> = new EventEmitter();

  collapsed = true;  // 🔹 default collapsed
  navdata = navbardata;
  screenWidth = 0;
  isMobileMenuOpen = false; 
  isMobileMenuOpens = false; 
  ishamburger:boolean=true
  adminData :any
  ngOnInit() {
    this.screenWidth = window.innerWidth;

    // Emit initial state to parent
    this.onToggelSideNav.emit({ collapsed: this.collapsed, screenwidth: this.screenWidth });
    const storedData = localStorage.getItem('adminData');
  if (storedData) {
    this.adminData = JSON.parse(storedData);
  }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;

    if (this.screenWidth <= 768) {
      this.collapsed = false; 
      this.isMobileMenuOpen = false; 
      this.onToggelSideNav.emit({ collapsed: this.collapsed, screenwidth: this.screenWidth });
    } else {
      this.onToggelSideNav.emit({ collapsed: this.collapsed, screenwidth: this.screenWidth });
    }
  }

  toggelCollapse() {
    this.collapsed = !this.collapsed;
    this.onToggelSideNav.emit({ collapsed: this.collapsed, screenwidth: this.screenWidth });
  }

 

toggleMobileMenu() {
  this.isMobileMenuOpen = !this.isMobileMenuOpen;
}

closeSidenave() {
  this.isMobileMenuOpen = false;
}
}

