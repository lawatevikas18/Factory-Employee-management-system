import { Component, OnInit } from '@angular/core';
import { Employee } from 'src/app/model/employee.model';
import { AuthService } from 'src/app/core/services/auth.service';
@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss']
})
export class EmployeeDetailsComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  searchText: string = '';

  // Dropdown data
  designations = ['Worker', 'Supervisor', 'Manager', 'Driver'];
  factories = ['Factory A', 'Factory B', 'Factory C'];
  states = ['Maharashtra', 'Karnataka', 'Gujarat', 'Madhya Pradesh'];
  countries = ['India', 'Nepal', 'Bangladesh', 'Sri Lanka'];

  selectedEmployee: Employee | null = null;
  isEmployeePopupOpen = false;
  isAddMode = false;
  selectedFactory: string = '';
  adminData: any;

  constructor(private apiService: AuthService) {}

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
    });
  }

  openAddEmployeePopup() {
    this.selectedEmployee = null;
    this.isAddMode = true;
    this.isEmployeePopupOpen = true;
  }

  openEditEmployee(emp: Employee) {
    this.selectedEmployee = { ...emp }; 
    this.isAddMode = false;
    this.isEmployeePopupOpen = true;
  }
  

  closeEmployeePopup() {
    this.isEmployeePopupOpen = false;
    this.selectedEmployee = null;
  }

  handleSave(employeeData: Employee) {
    if (this.isAddMode) {
      // create new unique id (safer than length+1)
      const newId = this.employees.length ? Math.max(...this.employees.map(e => e.id)) + 1 : 1;
      employeeData.id = newId;
      this.employees.push(employeeData);
    } else {
      const index = this.employees.findIndex(e => e.id === employeeData.id);
      if (index !== -1) {
        this.employees[index] = employeeData;
      }
    }
    this.filteredEmployees = [...this.employees];
    this.closeEmployeePopup();
  }

  trackByEmployee(index: number, emp: Employee) {
    return emp.id;
  }

  confirmDeleteEmployee(emp: Employee) {
    const confirmed = confirm(`Are you sure you want to delete ${emp.firstName} ${emp.lastName}?`);
    if (confirmed) {
      this.deleteEmployee(emp);
    }
  }

  deleteEmployee(emp: Employee) {
    this.employees = this.employees.filter(e => e.id !== emp.id);
    this.filteredEmployees = [...this.employees];
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
  }
}
