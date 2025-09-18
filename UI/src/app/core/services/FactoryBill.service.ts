import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FactoryBill } from 'src/app/model/FactoryBill.model';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class FactoryBillService {
  private apiUrl = `${environment.apiUrl}/FactoryBill`;

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token'); // ✅ Get token from localStorage (or service)
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAll(): Observable<FactoryBill[]> {
    return this.http.get<FactoryBill[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getById(id: number): Observable<FactoryBill> {
    return this.http.get<FactoryBill>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getByUser(userId: number): Observable<FactoryBill[]> {
    return this.http.get<FactoryBill[]>(`${this.apiUrl}/ByUser/${userId}`, { headers: this.getHeaders() });
  }

  create(bill: FactoryBill): Observable<FactoryBill> {
    return this.http.post<FactoryBill>(this.apiUrl, bill, { headers: this.getHeaders() });
  }

  update(bill: FactoryBill): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${bill.billId}`, bill, { headers: this.getHeaders() });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
