import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AttendanceService } from 'src/app/core/services/Attendance.Service';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { AttendanceRequest, EmployeeAttendance } from 'src/app/model/AttendanceRequest .model';
declare var bootstrap: any;


//import { Employee } from 'src/app/model/employee.model';
type attendanceStatus = 'Present' | 'HalfDay' | 'Late' | 'Absent' | null;

interface Employee {
  id: number;             
  employeeId: number;
  name: string;
  role: string;
  attendanceStatus: attendanceStatus;

}
@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent {
  employees: any[] = [];
  selectedDate: Date = new Date();
  roles: string[] = ['Supervisor', 'Manager', 'Driver', 'Worker'];
  selectedDates: string[] = [];
  isAddPopupOpen = false;
  // UI state'
  selectedEmployee: any;
    isEmployeePopupOpen = false;
    isAddMode = false;
    adminData: any;
  
    factories = ['Factory A', 'Factory B', 'Factory C'];
    states = ['Maharashtra', 'Karnataka', 'Gujarat', 'Madhya Pradesh'];
    countries = ['India', 'Nepal', 'Bangladesh', 'Sri Lanka'];

  newEmployee = { id: 0, name: '', role: '', attendanceStatus: null };
  selectedrole: string = '';
  searchTerm: string = '';
  emp: any = { name: 'John Doe', role: 'Developer', attendanceStatus: '' };
  today: string = new Date().toISOString().split('T')[0];
  isPopupOpen = false;
  useselectedDate: string = '';
 attendanceDate: string = new Date().toISOString().substring(0, 10);

 constructor(private http: HttpClient,
  private authService:AuthService,
  private getAttendance:AttendanceService,
  private router:Router,
  private loader:LoaderService
){}
  ngOnInit(): void {
    this.getEmplyees()
  }
  getEmplyees(){
    this.loader.show()
  let requestdata={
       fromDate:'',
       toDate:'',
       employeeId:'',
       day:this.attendanceDate
  }
    this.getAttendance.getAll()
  .subscribe({
    next: (res) => {
      this.employees = res;
        this.loader.hide(); 
      },
       error: (err) => {
        this.loader.hide();
        console.error('Error loading employees', err);
      },
      complete: () => {
        this.loader.hide(); 
      }
    })
  }

  // --- Filtering & getters ---

  // Employees after applying dropdown + search filters
  get filteredEmployees(): Employee[] {
    const term = this.searchTerm?.trim().toLowerCase() ?? '';
    return this.employees.filter(emp => {
      const matchrole = this.selectedrole
        ? emp.role.toLowerCase() === this.selectedrole.toLowerCase()
        : true;

      const matchSearch = term
        ? (emp.name.toLowerCase().includes(term) ||
           (emp.role && emp.role.toLowerCase().includes(term)))
        : true;

      return matchrole && matchSearch;
    });
  }

  // Summary counts based on the currently visible (filtered) list
  get summary() {
    const list = this.filteredEmployees;
    const fullDay = list.filter(e => e.attendanceStatus === 'Present').length;
    const halfDay = list.filter(e => e.attendanceStatus === 'HalfDay').length;
    const late = list.filter(e => e.attendanceStatus === 'Late').length;
    const absent = list.filter(e => e.attendanceStatus === 'Absent').length;
    const pending = list.filter(e => e.attendanceStatus === null).length;
    return { fullDay, halfDay, late, absent, pending };
  }

  // Total number of marked employees across whole dataset (used in Save button)
  get totalMarked(): number {
    return this.employees.filter(e => e.attendanceStatus !== null).length;
  }

  // --- Actions ---

  // Mark single employee
  markAttendance(emp: Employee, attendanceStatus: Exclude<attendanceStatus, null>): void {
    emp.attendanceStatus = attendanceStatus;
    // Angular change detection will update UI automatically
  }

  // Mark all filtered employees (only visible ones)
  markAllFiltered(attendanceStatus: Exclude<attendanceStatus, null>): void {
    const filtered = this.filteredEmployees;
    filtered.forEach(fe => {
      const original = this.employees.find(e => e.employeeId === fe.employeeId);
      if (original) original.attendanceStatus = attendanceStatus;
    });
  }

  // Clear statuses for filtered employees
  clearAllFiltered(): void {
    const filtered = this.filteredEmployees;
    filtered.forEach(fe => {
      const original = this.employees.find(e => e.employeeId === fe.employeeId);
      if (original) original.attendanceStatus = null;
    });
  }

  // Save attendance (hook this to API)
  saveAttendance(): void {
     const attendanceList :any= this.employees.map(emp => ({
      employeeId: emp.employeeId,
      attendanceStatus: emp.attendanceStatus || 'NotMarked',
      attendanceDate: this.attendanceDate
    }));

    // const request: AttendanceRequest = {
    //   adminId: '100', 
    //   action: 'Insert',
    //   attendanceList
    // };

      this.getAttendance.saveAttendance(attendanceList)
       .subscribe({
      next: (res) => {
      if (res.statusCode === 200) {
        console.log('Attendance saved:', res);
          alert('Attendance saved successfully!');
        }
      },
      error: err => {
          console.error('Error saving attendance', err);
        }
    })
  }

  // Helpers for template (optional)
  trackByEmployee(index: number, emp: Employee) {
    return emp.employeeId;
  }


  openPopup() {
    this.selectedDates = []; 
    this.isPopupOpen = true;
  }

  closePopup() {
    this.isPopupOpen = false;
  }

  addDate(event: any) {
    const date = event.target.value;
    if (date && !this.selectedDates.includes(date)) {
      this.selectedDates.push(date);
    }
    event.target.value = ""; 
  }

  removeDate(index: number) {
    this.selectedDates.splice(index, 1);
  }

  submitDates() {
    if (this.selectedDates.length > 0) {
      this.emp.attendanceStatus = `Updated with ${this.selectedDates.length} dates`;
      this.closePopup();
    } else {
      alert('Please select at least one date!');
    }
  }
 
  openAddPopup() {
    this.router.navigate(['/employee-details'], {
    queryParams: { 'from': 'Attendance' }
  });
  }

  closeAddPopup() {
    this.isAddPopupOpen = false;
  }

  addEmployee() {
    if (this.newEmployee.name && this.newEmployee.role) {
      const newId = this.employees.length > 0 
        ? Math.max(...this.employees.map(e => e.employeeId)) + 1 
        : 1;
      this.employees.push({ ...this.newEmployee, employeeId: newId });
      this.closeAddPopup();
    } else {
      alert('Please fill all fields.');
    }
  }


   closeEmployeePopup() {
      this.isEmployeePopupOpen = false;
      this.selectedEmployee = null;
    }
  
    handleSave(employeeData: Employee) {
      // if (this.isAddMode) {
       
      //   const newId = this.employees.length ? Math.max(...this.employees.map(e => e.id)) + 1 : 1;
      //   employeeData.id = newId;
      //   this.employees.push(employeeData);
      // } else {
      //   const index = this.employees.findIndex(e => e.id === employeeData.id);
      //   if (index !== -1) {
      //     this.employees[index] = employeeData;
      //   }
      // }
      this.employees = [...this.employees];
      this.closeEmployeePopup();
    }
}
