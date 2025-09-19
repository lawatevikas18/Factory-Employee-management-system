import { Component, OnInit } from '@angular/core';
import { Employee } from 'src/app/model/employee.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environment/environment';
@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss']
})
export class EmployeeDetailsComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  searchText: string = '';
   employees: any[] = [];
  wallets: any[] = [];
  form!: FormGroup;
  isEdit = false;
  selectedId: number | null = null;
  loading = false;
  message = '';
  error = '';

  // Dropdown data
  designations = ['Worker', 'Supervisor', 'Manager', 'Driver'];
  factories = ['Factory A', 'Factory B', 'Factory C'];
  states = ['Maharashtra', 'Karnataka', 'Gujarat', 'Madhya Pradesh'];
  countries = ['India', 'Nepal', 'Bangladesh', 'Sri Lanka'];
  private apiUrl = environment.apiUrl

  selectedEmployee: Employee | null = null;
  isEmployeePopupOpen = false;
  isAddMode = false;
  selectedFactory: string = '';
  adminData: any;

  constructor(private apiService: AuthService) {}
  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.employees = [
      {
        id: 1,
        firstName: 'John',
        middleName: 'D.',
        lastName: 'Smith',
        designation: 'Worker',
        factory: 'Factory A',
        salary: 18000,
        deposit: 5000,
        aadhar: '123456789012', // removed dashes to match validator
        carNo: 'MH12AB1234',
        panNo: 'ABCDE1234F',
        mobile1: '9876543210',
        mobile2: '9123456780',
        village: 'Village X',
        taluka: 'Taluka A',
        district: 'Pune',
        country: 'India',
        state: 'Maharashtra'
      },
      {
        id: 2,
        firstName: 'Asha',
        middleName: '',
        lastName: 'More',
        designation: 'Supervisor',
        factory: 'Factory B',
        salary: 22000,
        deposit: 7000,
        aadhar: '234567890123', // removed dashes
        carNo: 'MH14XY4567',
        panNo: 'FGHIJ5678K',
        mobile1: '9001234567',
        mobile2: '9823456789',
        village: 'Village Y',
        taluka: 'Taluka B',
        district: 'Solapur',
        country: 'India',
        state: 'Maharashtra'
      }
    ];
    this.filteredEmployees = [...this.employees];
  }

  getEmployeeDetails(){
    const request = {
      admin: this.adminData?.adminName,
      role: this.adminData?.role
    };
    this.apiService.getEmpListDetails(request).subscribe({
      next: (res: Employee[]) => {
        this.employees = res;
        this.filteredEmployees = [...this.employees];
      },
      error: (error) => {
        console.error(error);
      }
    this.form = this.fb.group({
      name: ['', Validators.required],
      address: [''],
      village: [''],
      taluka: [''],
      district: [''],
      state: [''],
      role: [''],
      aadhaar: ['', Validators.pattern(/^\d{12}$/)],
      panCard: ['', Validators.maxLength(10)],
      mobile1: ['', Validators.required],
      mobile2: [''],
      monthlySalary: [0, [Validators.required, Validators.min(0)]],
      factoryName: ['']
    });

    this.loadEmployees();
    this.loadWallets();
  }

  openAddEmployeePopup() {
    this.selectedEmployee = null;
    this.isAddMode = true;
    this.isEmployeePopupOpen = true;
  private getHeaders() {
    const token = localStorage.getItem('token') || '';
    return { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }) };
  }

  openEditEmployee(emp: Employee) {
    this.selectedEmployee = { ...emp }; 
    this.isAddMode = false;
    this.isEmployeePopupOpen = true;
  loadEmployees() {
    this.loading = true;
    this.http.get<any[]>(`${this.apiUrl}/Employee`, this.getHeaders())
      .subscribe({
        next: res => { this.employees = res; this.loading = false; },
        error: () => { this.error = 'Failed to load employees'; this.loading = false; }
      });
  }
  

  closeEmployeePopup() {
    this.isEmployeePopupOpen = false;
    this.selectedEmployee = null;
  loadWallets() {
    this.http.get<any[]>(`${this.apiUrl}/employee_wallete`, this.getHeaders())
      .subscribe({
        next: res => this.wallets = res,
        error: () => console.warn('Wallet fetch failed (Admin cannot view wallets)')
      });
  }

  handleSave(employeeData: Employee) {
    if (this.isAddMode) {
      // create new unique id (safer than length+1)
      const newId = this.employees.length ? Math.max(...this.employees.map(e => e.id)) + 1 : 1;
      employeeData.id = newId;
      this.employees.push(employeeData);
  submit() {
    if (this.form.invalid) {
      this.error = 'Please fill required fields correctly.';
      return;
    }

    this.error = '';
    const body = this.form.value;

    if (this.isEdit && this.selectedId) {
      this.http.put(`${this.apiUrl}/${this.selectedId}`, { ...body, employeeId: this.selectedId }, this.getHeaders())
        .subscribe({
          next: (res: any) => {
            this.message = res.message || 'Employee updated';
            this.resetForm();
            this.loadEmployees();
          },
          error: err => this.error = err?.error?.message || 'Update failed'
        });
    } else {
      const index = this.employees.findIndex(e => e.id === employeeData.id);
      if (index !== -1) {
        this.employees[index] = employeeData;
      }
      this.http.post( `${this.apiUrl}/Employee`, body, this.getHeaders())
        .subscribe({
          next: () => {
            this.message = 'Employee added';
            this.resetForm();
            this.loadEmployees();
          },
          error: err => this.error = err?.error?.message || 'Add failed'
        });
    }
    this.filteredEmployees = [...this.employees];
    this.closeEmployeePopup();
  }

  trackByEmployee(index: number, emp: Employee) {
    return emp.id;
  edit(emp: any) {
    this.isEdit = true;
    this.selectedId = emp.employeeId;
    this.form.patchValue(emp);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  confirmDeleteEmployee(emp: Employee) {
    const confirmed = confirm(`Are you sure you want to delete ${emp.firstName} ${emp.lastName}?`);
    if (confirmed) {
      this.deleteEmployee(emp);
    }
  delete(empId: number) {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    this.http.delete(`${this.apiUrl}/${empId}`, this.getHeaders())
      .subscribe({
        next: (res: any) => {
          this.message = res.message || 'Employee deleted';
          this.loadEmployees();
          this.loadWallets();
        },
        error: err => this.error = err?.error?.message || 'Delete failed'
      });
  }

  deleteEmployee(emp: Employee) {
    this.employees = this.employees.filter(e => e.id !== emp.id);
    this.filteredEmployees = [...this.employees];
  resetForm() {
    this.isEdit = false;
    this.selectedId = null;
    this.form.reset({ monthlySalary: 0 });
  }

  filterEmployees() {
    const text = this.searchText.toLowerCase();
    const factory = this.selectedFactory;

    this.filteredEmployees = this.employees.filter(emp =>
      (emp.firstName.toLowerCase().includes(text) ||
       (emp.lastName && emp.lastName.toLowerCase().includes(text)) ||
       emp.designation.toLowerCase().includes(text) ||
       emp.factory.toLowerCase().includes(text)) &&
      (factory === '' || emp.factory === factory)
    );
  walletBalance(empId: number) {
    const w = this.wallets.find(x => x.employeeId === empId);
    return w ? w.advanceBalance : 0;
  }
}
