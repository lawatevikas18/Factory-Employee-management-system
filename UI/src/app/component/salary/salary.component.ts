import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

interface Employee {
  id: number;
  name: string;
  designation: string;
  status: 'Paid' | 'Pending' | null;
  salary: number;
  advance: number;
}

@Component({
  selector: 'app-salary',
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.scss']
})
export class SalaryComponent implements OnInit {

  employees: Employee[] = [];
  selectedEmployee: Employee | null = null;
  isSalaryPopupOpen = false;
  searchText: string = '';
  currentUserRole: 'Manager' | 'Employee' = 'Manager';
  filteredEmployees: Employee[] = [];
  isSearchFocused: boolean = false;

  constructor(private toastr: ToastrService) {}

  ngOnInit(): void {
    this.employees = [
      { id: 1, name: 'John Smith', designation: 'Supervisor', status: 'Paid', salary: 45000, advance: 5000 },
      { id: 2, name: 'Sarah Johnson', designation: 'Manager', status: 'Pending', salary: 60000, advance: 0 },
      { id: 3, name: 'Mike Brown', designation: 'Driver', status: 'Pending', salary: 25000, advance: 2000 },
      { id: 4, name: 'Priya Desai', designation: 'Worker', status: 'Paid', salary: 18000, advance: 0 },
      { id: 5, name: 'Ramesh Patil', designation: 'Supervisor', status: 'Pending', salary: 42000, advance: 1000 },
      { id: 6, name: 'Asha More', designation: 'Worker', status: 'Paid', salary: 20000, advance: 0 },
      { id: 7, name: 'Vikram Rao', designation: 'Driver', status: 'Pending', salary: 27000, advance: 1500 },
      { id: 8, name: 'Sita Kulkarni', designation: 'Manager', status: 'Paid', salary: 58000, advance: 0 }
    ];
    this.filteredEmployees = [...this.employees];
  }

  get pendingCount(): number {
    return this.employees.filter(e => e.status === 'Pending' || e.status === null).length;
  }

  openSalaryPopup(emp: Employee) {
    if (this.currentUserRole !== 'Manager') {
      this.toastr.error('Only Managers can modify salary');
      return;
    }
    // clone to prevent direct edit until saved
    this.selectedEmployee = { ...emp };
    this.isSalaryPopupOpen = true;
  }

  closeSalaryPopup() {
    this.isSalaryPopupOpen = false;
    this.selectedEmployee = null;
  }

  saveSalaryChanges() {
    if (!this.selectedEmployee) return;
  
    // find the original employee
    const empIndex = this.employees.findIndex(e => e.id === this.selectedEmployee!.id);
    if (empIndex !== -1) {
      // Update salary, advance, and mark status as Paid
      this.employees[empIndex] = {
        ...this.selectedEmployee,
        status: 'Paid'
      };
      this.toastr.success(`${this.selectedEmployee.name}'s salary updated and marked as Paid`);
      this.closeSalaryPopup();
    }
  }
  

  trackByEmployee(index: number, emp: Employee) {
    return emp.id;
  }

  filterEmployees() {
    const text = this.searchText.toLowerCase();
    this.filteredEmployees = this.employees.filter(emp =>
      emp.name.toLowerCase().includes(text) ||
      emp.designation.toLowerCase().includes(text) ||
      emp.status?.toLowerCase().includes(text)
    );
  }
}
