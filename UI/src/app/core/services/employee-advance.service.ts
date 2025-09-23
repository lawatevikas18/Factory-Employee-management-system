import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { Employee } from './employee.service';

export interface AdvanceTransaction {
  advanceId?: number;
  employeeId: number;
  userId?: number; // will be set by backend
  reason: string;
  paymentMode: string;
  amount: number;
  date?: string;
  createdAT?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeAdvancesService {
   private getHeaders() {
        const token = localStorage.getItem('token'); // ✅ Get token from localStorage (or service)
        return new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
      }
  private baseUrl = `${environment.apiUrl}/EmployeeAdvances`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<AdvanceTransaction[]> {
    return this.http.get<AdvanceTransaction[]>(this.baseUrl,{ headers: this.getHeaders() });
  }

 
  sendAdvance(transaction: AdvanceTransaction): Observable<any> {
    return this.http.post(this.baseUrl, transaction,{ headers: this.getHeaders() });
  }
}