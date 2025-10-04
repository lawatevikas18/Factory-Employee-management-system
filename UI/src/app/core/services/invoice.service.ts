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

  
  
private getHeaders() {
    const token = sessionStorage.getItem('token'); // ✅ Get token from sessionStorage (or service)
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
  

  create(dto: InvoiceDTO): Observable<any> {
       return this.http.post(`${this.apiBase}/create`, dto, { headers: this.getHeaders() });
  }

  
  getAll(): Observable<Invoice[]> {
        return this.http.get<Invoice[]>(`${this.apiBase}/all`, { headers: this.getHeaders() });
  }
    
  getById(id: number) {
       return this.http.get<Invoice>(`${this.apiBase}/${id}`, { headers: this.getHeaders() });
  }

  update(id: number, dto: InvoiceDTO) {
   
    return this.http.put(`${this.apiBase}/update/${id}`, dto,  { headers: this.getHeaders() });
  }

  delete(id: number) {
    
    return this.http.delete(`${this.apiBase}/delete/${id}`,  { headers: this.getHeaders() });
  }
}