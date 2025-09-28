import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Invoice, InvoiceDTO } from 'src/app/model/invoice-data.model';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  
private apiBase = `${environment.apiUrl}/Invoice`
  constructor(private http: HttpClient) {}

  private headers() {
    const token = localStorage.getItem('token') || '';
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    };
  }

  create(dto: InvoiceDTO): Observable<any> {
    return this.http.post(`${this.apiBase}/create`, dto, this.headers());
  }

  getAll(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.apiBase}/all`, this.headers());
  }

  getById(id: number) {
    return this.http.get<Invoice>(`${this.apiBase}/${id}`, this.headers());
  }

  update(id: number, dto: InvoiceDTO) {
    return this.http.put(`${this.apiBase}/update/${id}`, dto, this.headers());
  }

  delete(id: number) {
    return this.http.delete(`${this.apiBase}/delete/${id}`, this.headers());
  }
}
