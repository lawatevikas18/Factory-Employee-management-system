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
type status = 'Present' | 'HalfDay' | 'OT' | 'Absent' | null;

interface Employee {
  id: number;             
  employeeId: number;
  name: string;
  role: string;
  status: status;
 ot?: number | null;
 photo:any

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

  newEmployee = { id: 0, name: '', role: '', status: null };
  selectedrole: string = '';
  searchTerm: string = '';
  emp: any = { name: 'John Doe', role: 'Developer', status: '' };
  today: string = new Date().toISOString().split('T')[0];
  isPopupOpen = false;
  useselectedDate: string = '';
 date: string = new Date().toISOString().substring(0, 10);
  showDatepicker = false;
   UserRole:any
   
 constructor(private http: HttpClient,
  private authService:AuthService,
  private getAttendance:AttendanceService,
  private router:Router,
  private loader:LoaderService
){}
  ngOnInit(): void {
    this.UserRole=this.authService.getUserRole()
    const formattedDate = this.selectedDate.toISOString().split('T')[0];
    this.getEmplyees(formattedDate)
  }
  getEmplyees(date:any){
    this.loader.show()
  let requestdata={
       fromDate:'',
       toDate:'',
       employeeId:'',
       day:this.date
  }
    this.getAttendance.getAll(date)
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
    const fullDay = list.filter(e => e.status === 'Present').length;
    const halfDay = list.filter(e => e.status === 'HalfDay').length;
    const OT = list.filter(e => e.status === 'OT').length;
    const absent = list.filter(e => e.status === 'Absent').length;
    const pending = list.filter(e => e.status === null).length;
    return { fullDay, halfDay, OT, absent, pending };
  }

  // Total number of marked employees across whole dataset (used in Save button)
  get totalMarked(): number {
    return this.employees.filter(e => e.status !== null).length;
  }

  // --- Actions ---

  // Mark single employee
  markAttendance(emp: Employee, status: Exclude<status, null>): void {
    if(this.UserRole!=='Admin'){
         emp.status = status;
    }
    
    // Angular change detection will update UI automatically
  }
 setOT(emp: Employee, hours: number) {
  if (this.UserRole !== 'Admin' && emp.status === 'Present') {
    emp.ot = hours;   // ✅ store as number
  }
}

  // Mark all filtered employees (only visible ones)
  markAllFiltered(status: Exclude<status, null>): void {
    if(this.UserRole!=='Admin'){
    const filtered = this.filteredEmployees;
    filtered.forEach(fe => {
      const original = this.employees.find(e => e.employeeId === fe.employeeId);
      if (original) original.status = status;
    });
  }
  }

  // Clear statuses for filtered employees
  clearAllFiltered(): void {
    if(this.UserRole!=='Admin'){
    const filtered = this.filteredEmployees;
    filtered.forEach(fe => {
      const original = this.employees.find(e => e.employeeId === fe.employeeId);
      if (original) original.status = null;
    });
  }
  }

  // Save attendance (hook this to API)
  saveAttendance(): void {
  if(this.UserRole !== 'Admin'){
    const attendanceList: any = this.employees.map(emp => ({
      employeeId: emp.employeeId,
      status: emp.status || 'NotMarked',
       
      date: this.date,
      ot: emp.ot || 0
    }));
    this.loader.show()
    this.getAttendance.saveAttendance(attendanceList).subscribe({
      next: (res) => {
        this.loader.hide()
        if (res.statusCode === 200) {
          alert('Attendance saved successfully!');
        }
      },
      
      error: err => console.error('Error saving attendance', err)
      
    });
  }
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
      this.emp.status = `Updated with ${this.selectedDates.length} dates`;
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

    

    decreaseDate() {
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);

  // Only decrease if selectedDate is greater than sevenDaysAgo
  if (this.selectedDate > sevenDaysAgo) {
    this.selectedDate = new Date(this.selectedDate.setDate(this.selectedDate.getDate() - 1));
    const formattedDate = this.selectedDate.toISOString().split('T')[0];
    this.getEmplyees(formattedDate);
  } else {
    console.log("You can only view up to 7 days in the past.");
  }
}


  increaseDate() {
  const today = new Date();


  // If current selectedDate is before today, allow increment
  if (this.selectedDate < today) {
    const newDate = new Date(this.selectedDate);
    newDate.setDate(this.selectedDate.getDate() + 1);
    
    // Ensure it never goes beyond today
    if (newDate <= today) {
      this.selectedDate = newDate;
      const formattedDate = this.selectedDate.toISOString().split('T')[0];
      this.getEmplyees(formattedDate)
    }
  }
}


  openCalendar() {
    this.showDatepicker = !this.showDatepicker;
  }

  onDateSelect(date: any) {
    this.selectedDate = new Date(date.year, date.month - 1, date.day);
    this.showDatepicker = false;
  }
  report(){
    this.router.navigate(['/reports'])
  }

 triggerFileInput(fileInput: HTMLInputElement) {
  fileInput.click();
}

  // Handle file selection
  onFileSelected(event: any, emp: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        emp.photo = e.target.result; // set base64 as photo
      };
      reader.readAsDataURL(file);
    }
  }

}
 
