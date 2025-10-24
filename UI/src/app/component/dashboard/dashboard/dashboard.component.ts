import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { ErrorPopUpService } from 'src/app/core/services/error-pop-up.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { SessionService } from 'src/app/core/services/session.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
<<<<<<< HEAD
export class DashboardComponent {
 totalSites:any=0;
  workingSitesToday:any=0;
  totalEmployees:any=0;
  presentEmployeesToday:any=0;
  absentEmployeesToday = 14;
  lateEmployeesToday = 8;
  totalBalance:any=0
=======
export class DashboardComponent implements OnInit {
>>>>>>> 9ae7ec781a7f8d4e1f4a0eb5f23ca4d6245064a3

  totalSites = 0;
  workingSitesToday = 0;
  totalEmployees = 0;
  presentEmployeesToday = 0;
  totalBalance = 0;
  userName = '';
  factoryName = '';
  role = '';
  imageurl = ''

  attendancePercentage = 0;
  siteOperationalPercentage = 0;
<<<<<<< HEAD
  getfactoryName: any;
  userName:any
=======
>>>>>>> 9ae7ec781a7f8d4e1f4a0eb5f23ca4d6245064a3

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
<<<<<<< HEAD
        // this.employees = res;
        console.log(`res`,res.factoryName);
        this.getfactoryName=res.factoryName;
        this.totalBalance=res.total_balance
          this.userName = res.userName;
         this.session.setUserDetails(res)
    if (this.userName) {
      this.loaderService.setUserName(this.userName);
    }
        console.log(res.userName);
        this.totalEmployees=res.employee_count
      this.presentEmployeesToday=res.attendance_count_today
      this.workingSitesToday=res.active_site.length
      this.totalSites=res.total_site
          this.authService.setUserRole(res.role)
        this.loader.hide();   // ✅ Hide on success
=======
        this.userName = res.userName;
        this.imageurl = res.imagePath;
        this.factoryName = res.factoryName;
        this.role = res.role;
        this.totalEmployees = res.employee_count;
        this.presentEmployeesToday = res.attendance_count_today;
        this.workingSitesToday = res.active_site?.length || 0;
        this.totalSites = res.total_site;
        this.totalBalance = res.total_balance || 0;

    localStorage.setItem('userName', this.userName);
    localStorage.setItem('factoryName', this.factoryName);
    localStorage.setItem('role', this.role);



        this.authService.setUserRole(this.role);
        this.session.setUserDetails(res);
        this.calculatePercentages();
>>>>>>> 9ae7ec781a7f8d4e1f4a0eb5f23ca4d6245064a3
      },
      error: (err) => {
        this.errorMsg.showError(err?.error);
        console.error('Error loading dashboard', err);
      },
      complete: () => this.loader.hide()
    });
  }
}
