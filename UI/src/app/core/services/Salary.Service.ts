import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SalaryTransaction {
  salaryId?: number;
  employeeId: number;
  userId: number;
  startDate: string;
  endDate: string;
  month?: string;
  presentDays: number;
  absentDays: number;
  halfDays: number;
  totalSalary: number;
  advanceDeducted: number;
  finalSalary: number;
  date?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SalaryService {
  private api = `${(window as any).__env?.apiUrl || ''}/api/Salary`; // or use environment.apiUrl

  constructor(private http: HttpClient) {}

  private authHeaders(): { headers: HttpHeaders } {
    const token = sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    return { headers };
  }

  getAllSalaryTransactions(): Observable<SalaryTransaction[]> {
    return this.http.get<SalaryTransaction[]>(`${this.api}/GetAllSalaryTransactions`, this.authHeaders());
  }

  // Generate salary: backend expects (int employeeId, DateTime startDate, DateTime endDate)
  // We'll call as query params or body depending on your API. Your controller has [HttpPost("GenerateSalary")] with params
  generateSalary(employeeId: number, startDate: string, endDate: string): Observable<any> {
    // Use query string body since controller signature is primitive parameters
    const body = { employeeId, startDate, endDate };
    // Some backends accept JSON body with same names.
    return this.http.post<any>(`${this.api}/GenerateSalary`, body, this.authHeaders());
  }
}
