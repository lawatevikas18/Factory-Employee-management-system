
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

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
  private apiUrl = `${environment.apiUrl}/Employee`;

  constructor(private http: HttpClient) {}
   private getHeaders() {
      const token = sessionStorage.getItem('token'); // ✅ Get token from sessionStorage (or service)
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    }

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl,{ headers: this.getHeaders() });
  }

  getEmployee(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`,{ headers: this.getHeaders() });
  }

  addEmployee(formdata:any): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, formdata,{ headers: this.getHeaders() });
  }

  updateEmployee(id: number, employee: Employee) {
    return this.http.put(`${this.apiUrl}/${id}`, employee,{ headers: this.getHeaders() });
  }

  deleteEmployee(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`,{ headers: this.getHeaders() });
  }

  getWallets(): Observable<EmployeeWallet[]> {
    return this.http.get<EmployeeWallet[]>(`${this.apiUrl}/employee_wallete`,{ headers: this.getHeaders() });
  }
  getDashBoardData(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/AdminToUserTransaction/DashboardStats`,{ headers: this.getHeaders() });
  }

     getAllEmployees(): Observable<Employee[]> {
      return this.http.get<Employee[]>(this.apiUrl ,{ headers: this.getHeaders() } );
    }
  
}
