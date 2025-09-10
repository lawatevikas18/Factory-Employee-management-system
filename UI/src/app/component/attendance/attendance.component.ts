import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth.service';
import { AttendanceRequest, EmployeeAttendance } from 'src/app/model/AttendanceRequest .model';
declare var bootstrap: any;


//import { Employee } from 'src/app/model/employee.model';
type Status = 'Full Day' | 'Half Day' | 'Late' | 'Absent' | null;

interface Employee {
  employeeCode: number;
  name: string;
  designation: string;
  status: Status;
  
  
  // add other fields if needed (employeeCode, factory, etc.)
}
@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent {
  employees: Employee[] = [];
  selectedDate: Date = new Date();
  designations: string[] = ['Supervisor', 'Manager', 'Driver', 'Worker'];
  selectedDates: string[] = [];
  isAddPopupOpen = false;
  // UI state'
  newEmployee = { id: 0, name: '', designation: '', status: null };
  selectedDesignation: string = '';
  searchTerm: string = '';
  emp: any = { name: 'John Doe', designation: 'Developer', status: '' };
  today: string = new Date().toISOString().split('T')[0];
  isPopupOpen = false;
  useselectedDate: string = '';
 attendanceDate: string = new Date().toISOString().substring(0, 10);

 constructor(private http: HttpClient,
  private authService:AuthService
){}
  ngOnInit(): void {
    this.getEmplyees()
  }
  getEmplyees(){
  let requestdata={
       fromDate:'',
       toDate:'',
       employeeCode:'',
       day:this.attendanceDate
  }
    this.authService.getReport(requestdata)
  .subscribe({
    next: (res) => {
      if (res.statusCode === 200) {
        this.employees = res.jsonStr;
        }
      }
    })
  }

  // --- Filtering & getters ---

  // Employees after applying dropdown + search filters
  get filteredEmployees(): Employee[] {
    const term = this.searchTerm?.trim().toLowerCase() ?? '';
    return this.employees.filter(emp => {
      const matchDesignation = this.selectedDesignation
        ? emp.designation.toLowerCase() === this.selectedDesignation.toLowerCase()
        : true;

      const matchSearch = term
        ? (emp.name.toLowerCase().includes(term) ||
           (emp.designation && emp.designation.toLowerCase().includes(term)))
        : true;

      return matchDesignation && matchSearch;
    });
  }

  // Summary counts based on the currently visible (filtered) list
  get summary() {
    const list = this.filteredEmployees;
    const fullDay = list.filter(e => e.status === 'Full Day').length;
    const halfDay = list.filter(e => e.status === 'Half Day').length;
    const late = list.filter(e => e.status === 'Late').length;
    const absent = list.filter(e => e.status === 'Absent').length;
    const pending = list.filter(e => e.status === null).length;
    return { fullDay, halfDay, late, absent, pending };
  }

  // Total number of marked employees across whole dataset (used in Save button)
  get totalMarked(): number {
    return this.employees.filter(e => e.status !== null).length;
  }

  // --- Actions ---

  // Mark single employee
  markAttendance(emp: Employee, status: Exclude<Status, null>): void {
    emp.status = status;
    // Angular change detection will update UI automatically
  }

  // Mark all filtered employees (only visible ones)
  markAllFiltered(status: Exclude<Status, null>): void {
    const filtered = this.filteredEmployees;
    filtered.forEach(fe => {
      const original = this.employees.find(e => e.employeeCode === fe.employeeCode);
      if (original) original.status = status;
    });
  }

  // Clear statuses for filtered employees
  clearAllFiltered(): void {
    const filtered = this.filteredEmployees;
    filtered.forEach(fe => {
      const original = this.employees.find(e => e.employeeCode === fe.employeeCode);
      if (original) original.status = null;
    });
  }

  // Save attendance (hook this to API)
  saveAttendance(): void {
     const attendanceList: EmployeeAttendance[] = this.employees.map(emp => ({
      employeeId: emp.employeeCode,
      status: emp.status || 'NotMarked',
      attendanceDate: this.attendanceDate
    }));

    const request: AttendanceRequest = {
      adminId: '100', 
      action: 'Insert',
      attendanceList
    };

      this.authService.getReport(request)
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
    return emp.employeeCode;
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
      this.emp.status = `Updated with ${this.selectedDates.length} dates`;
      this.closePopup();
    } else {
      alert('Please select at least one date!');
    }
  }
 
  openAddPopup() {
    this.isAddPopupOpen = true;
    this.newEmployee = { id: 0, name: '', designation: '', status: null }; // reset form
  }

  closeAddPopup() {
    this.isAddPopupOpen = false;
  }

  addEmployee() {
    if (this.newEmployee.name && this.newEmployee.designation) {
      const newId = this.employees.length > 0 
        ? Math.max(...this.employees.map(e => e.employeeCode)) + 1 
        : 1;
      this.employees.push({ ...this.newEmployee, employeeCode: newId });
      this.closeAddPopup();
    } else {
      alert('Please fill all fields.');
    }
  }
}
