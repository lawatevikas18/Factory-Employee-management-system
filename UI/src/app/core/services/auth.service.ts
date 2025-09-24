import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
@Injectable({ providedIn: 'root' })
export class AuthService {
 private role:any
  constructor(private http: HttpClient) {
    
  }
  private baseUrl = 'https://emp360-001-site1.stempurl.com/api/'; 
  private TOKEN_KEY = 'jwt_token';


  
  private getHeaders() {
    const token = sessionStorage.getItem('token'); // ✅ Get token from sessionStorage (or service)
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
  
  // login(request: any) {
  //   // sessionStorage.setItem(this.TOKEN_KEY, token);
  // }

  // login(request: any): Observable<any> {
  //   return this.http.post(`${this.baseUrl}/login`, request);
  // }
  getEmpListDetails(request: any) : Observable<any> {
    return this.http.post(`${this.baseUrl}getEmployeeList`, request);
  }
 addEmployee(request: any): Observable<any>{
    return this.http.post(`${this.baseUrl}/Employee`, request);
 }
//  saveAttendance(request: any): Observable<any>{
//     return this.http.post(`${this.baseUrl}/saveAttendance`, request);
//  }

saveAttendance(requestdata:any): Observable<any> {
  return this.http.post<any>(`${this.baseUrl}/Attendance`,requestdata,{ headers: this.getHeaders() });
  }

// getReport(requestdata:any): Observable<any> {
//   return this.http.post<any>(`${this.baseUrl}/attendanceReport`, requestdata);
//   }

postattendance(requestdata:any): Observable<any> {
  return this.http.post<any>(`${this.baseUrl}Attendance`, requestdata, { headers: this.getHeaders() });
  }


getReport(requestdata:any): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}Employee`, { headers: this.getHeaders() });
  }
 downloadReportPdf(requestdata:any): Observable<any> {
  return this.http.post<any>(`${this.baseUrl}attendanceReport/pdf`, requestdata);
  }




  logout() {
    sessionStorage.removeItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }


   //datta 
  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}Auth/register`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}Auth/login`, data);
  }

  setUserRole(userole:any){
    this.role=userole
  }
  getUserRole(){
return this.role
  }
  // setUserRole(userole:any){
  //   this.role=userole
  // }
}


