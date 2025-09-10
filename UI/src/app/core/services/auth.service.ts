import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
@Injectable({ providedIn: 'root' })
export class AuthService {
baseUrl:any
  constructor(private http: HttpClient) {
   this.baseUrl=environment.apiUrl
  }
  private TOKEN_KEY = 'jwt_token';

  // login(request: any) {
  //   // localStorage.setItem(this.TOKEN_KEY, token);
  // }

  login(request: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, request);
  }
  getEmpListDetails(request: any) : Observable<any> {
    return this.http.post(`${this.baseUrl}/getEmployeeList`, request);
  }
 addEmployee(request: any): Observable<any>{
    return this.http.post(`${this.baseUrl}/registoreEmployee`, request);
 }
 saveAttendance(request: any): Observable<any>{
    return this.http.post(`${this.baseUrl}/saveAttendance`, request);
 }
getReport(requestdata:any): Observable<any> {
  return this.http.post<any>(`${this.baseUrl}/attendanceReport`, requestdata);
  }
 downloadReportPdf(requestdata:any): Observable<any> {
  return this.http.post<any>(`${this.baseUrl}/attendanceReport/pdf`, requestdata);
  }




  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}
