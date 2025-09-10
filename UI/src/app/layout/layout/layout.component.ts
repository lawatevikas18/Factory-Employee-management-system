import { Component } from '@angular/core';
interface SideNavToggle{
  screenwidth:number;
  collapsed:boolean;

}
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
isSideNaveCollapsed=false
screenWidth=0
onToggelSideNav(data:SideNavToggle){
this.screenWidth=data.screenwidth
this.isSideNaveCollapsed=data.collapsed
}
}
