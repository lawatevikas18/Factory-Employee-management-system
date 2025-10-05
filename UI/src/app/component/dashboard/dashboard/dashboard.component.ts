import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { ErrorPopUpService } from 'src/app/core/services/error-pop-up.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { SessionService } from 'src/app/core/services/session.service';

interface SiteData {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'maintenance';
  employeeCount: number;
  presentToday: number;
  location: string;
}

interface EmployeeData {
  id: string;
  name: string;
  designation: string;
  status: 'present' | 'absent' | 'late';
  site: string;
  checkInTime?: string;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
 totalSites:any=0;
  workingSitesToday:any=0;
  totalEmployees:any=0;
  presentEmployeesToday:any=0;
  absentEmployeesToday = 14;
  lateEmployeesToday = 8;

  // sites: SiteData[] = [
  //   { id: '1', name: 'Factory Unit A', status: 'active', employeeCount: 45, presentToday: 42, location: 'Pandharpur' },
  //   { id: '2', name: 'Factory Unit B', status: 'active', employeeCount: 38, presentToday: 35, location: 'Solapur' },
  //   { id: '3', name: 'Warehouse North', status: 'active', employeeCount: 22, presentToday: 20, location: 'Mumbai' },
  //   { id: '4', name: 'Processing Center', status: 'maintenance', employeeCount: 15, presentToday: 0, location: 'Pune' },
  //   { id: '5', name: 'Admin Office', status: 'active', employeeCount: 12, presentToday: 12, location: 'Pandharpur' },
  // ];

  // recentEmployees: EmployeeData[] = [
  //   { id: '1', name: 'John Smith', designation: 'Manager', status: 'present', site: 'Factory Unit A', checkInTime: '08:00 AM' },
  //   { id: '2', name: 'Sarah Johnson', designation: 'Supervisor', status: 'late', site: 'Factory Unit B', checkInTime: '09:15 AM' },
  //   { id: '3', name: 'Mike Davis', designation: 'Operator', status: 'present', site: 'Warehouse North', checkInTime: '07:45 AM' },
  //   { id: '4', name: 'Lisa Anderson', designation: 'Technician', status: 'absent', site: 'Processing Center' },
  //   { id: '5', name: 'Robert Wilson', designation: 'Driver', status: 'present', site: 'Admin Office', checkInTime: '08:30 AM' },
  // ];

  attendancePercentage = 0;
  siteOperationalPercentage = 0;
  getfactoryName: any;

  constructor(private loader:LoaderService,
    private employeeService:EmployeeService,
    private errormsg:ErrorPopUpService,
    private authService:AuthService,
    private loaderService :LoaderService,
    private session:SessionService
  ) { }

  ngOnInit(): void {
    this.loadDashboardDeatils()
    this.calculatePercentages();
  }

  calculatePercentages(): void {
    this.attendancePercentage = Math.round((this.presentEmployeesToday / this.totalEmployees) * 100);
    this.siteOperationalPercentage = Math.round((this.workingSitesToday / this.totalSites) * 100);
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'active':
      case 'present':
        return 'badge-success';
      case 'late':
      case 'maintenance':
        return 'badge-warning';
      case 'inactive':
      case 'absent':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  }

  getStatusDotClass(status: string): string {
    switch (status) {
      case 'active':
      case 'present':
        return 'status-present';
      case 'late':
        return 'status-late';
      case 'inactive':
      case 'absent':
        return 'status-absent';
      case 'maintenance':
        return 'status-maintenance';
      default:
        return 'status-absent';
    }
  }

  getAttendanceRate(site: SiteData): number {
    return site.employeeCount > 0 ? Math.round((site.presentToday / site.employeeCount) * 100) : 0;
  }

  loadDashboardDeatils() {
    this.loader.show();   
    this.employeeService.getDashBoardData().subscribe({
      next: (res) => {
        // this.employees = res;
        console.log(`res`,res.factoryName);
        this.getfactoryName=res.factoryName;
         const name = res.userName;
         this.session.setUserDetails(res)
    if (name) {
      this.loaderService.setUserName(name);
    }
        console.log(res.userName);
        this.totalEmployees=res.employee_count
      this.presentEmployeesToday=res.attendance_count_today
      this.workingSitesToday=res.active_site.length
      this.totalSites=res.total_site
          this.authService.setUserRole(res.role)
        this.loader.hide();   // ✅ Hide on success
      },
      error: (err) => {
        this.loader.hide();
        this.errormsg.showError(err?.error)
        console.error('Error loading employees', err);
      },
      complete: () => {
        this.loader.hide(); 
      }
    });
  }
}
