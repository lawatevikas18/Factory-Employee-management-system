
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Employee {
  employeeId?: number;
  name: string;
  address?: string;
  village?: string;
  taluka?: string;
  district?: string;
  state?: string;
  role?: string;
  aadhaar?: string;
  panCard?: string;
  mobile1?: string;
  mobile2?: string;
  monthlySalary: number;
}

export interface EmployeeWallet {
  employeeId: number;
  advanceBalance: number;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'https://localhost:5001/api/Employee';

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }

  getEmployee(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  addEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee);
  }

  updateEmployee(id: number, employee: Employee) {
    return this.http.put(`${this.apiUrl}/${id}`, employee);
  }

  deleteEmployee(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getWallets(): Observable<EmployeeWallet[]> {
    return this.http.get<EmployeeWallet[]>(`${this.apiUrl}/employee_wallete`);
  }
}
