import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { ErrorPopUpService } from 'src/app/core/services/error-pop-up.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { SessionService } from 'src/app/core/services/session.service';
import { environment } from 'src/environment/environment';

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
  totalBalance:any=0
  userName = '';
  factoryName = '';
  role = '';
  imageurl = ''
  photoUrl = environment.photoUrl;

  attendancePercentage = 0;
  siteOperationalPercentage = 0;

  constructor(
    private loader: LoaderService,
    private employeeService: EmployeeService,
    private errorMsg: ErrorPopUpService,
    private authService: AuthService,
    private session: SessionService
  ) {}

  ngOnInit(): void {
    this.loadDashboardDetails();
  }

  private calculatePercentages(): void {
    this.attendancePercentage = this.totalEmployees
      ? Math.round((this.presentEmployeesToday / this.totalEmployees) * 100)
      : 0;

    this.siteOperationalPercentage = this.totalSites
      ? Math.round((this.workingSitesToday / this.totalSites) * 100)
      : 0;
  }

  private loadDashboardDetails(): void {
    this.loader.show();
    this.employeeService.getDashBoardData().subscribe({
      next: (res) => {
        this.userName = res.userName;
        this.imageurl = res.imageurl;
        this.factoryName = res.factoryName;
        this.role = res.role;
        this.totalEmployees = res.employee_count;
        this.presentEmployeesToday = res.attendance_count_today;
        this.workingSitesToday = res.active_site?.length || 0;
        this.totalSites = res.total_site;
        this.totalBalance = res.total_balance || 0;

    sessionStorage.setItem('userName', this.userName);
    sessionStorage.setItem('factoryName', this.factoryName);
    sessionStorage.setItem('role', this.role);
    



        this.authService.setUserRole(this.role);
        this.session.setUserDetails(res);
        this.calculatePercentages();
      },
      error: (err) => {
        this.errorMsg.showError(err?.error);
        console.error('Error loading dashboard', err);
      },
      complete: () => this.loader.hide()
    });
  }
}
