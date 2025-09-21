import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';


export interface Employee {
  id: number;        // Sr No
  name: string;      // Full Name
  mobileNo: string;  // Mobile Number
  source: string;    // Source
  reason: string;    // Reason
  credit: number;    // Credit
  debit: number;     // Debit
  total: number;     // Total = credit - debit
}


@Component({
  selector: 'app-advance',
  templateUrl: './advance.component.html',
  styleUrls: ['./advance.component.scss']
})
export class AdvanceComponent {

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
      // this.employees = [
      //   {
      //     id: 1,
      //     name: 'John D. Smith',
      //     mobileNo: '9876543210',
      //     source: 'Factory A',
      //     reason: 'Advance Request',
      //     credit: 18000,
      //     debit: 5000,
      //     total: 18000 - 5000
      //   },
      //   {
      //     id: 2,
      //     name: 'Asha More',
      //     mobileNo: '9001234567',
      //     source: 'Factory B',
      //     reason: 'Medical',
      //     credit: 22000,
      //     debit: 7000,
      //     total: 22000 - 7000
      //   }
      // ];
      this. getEmployeeDetails()
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
      const confirmed = confirm(`Are you sure you want to delete ${emp.name}?`);
      if (confirmed) {
        this.deleteEmployee(emp.id);
      }
    }
    
    deleteEmployee(id: number) {
      this.employees = this.employees.filter(e => e.id !== id);
      this.filteredEmployees = [...this.employees];
    }


    viewEmployee(emp: Employee) {
      alert(`Viewing details of: ${emp.name}`);
    }
  
    filterEmployees() {
      const text = this.searchText.toLowerCase();  
      const factory = this.selectedFactory;
    
      this.filteredEmployees = this.employees.filter(emp =>
        (emp.name.toLowerCase().includes(text) ||
         emp.source.toLowerCase().includes(text) ||
         emp.reason.toLowerCase().includes(text)) &&
        (factory === '' || emp.reason === factory)
      );
    }
    
}
