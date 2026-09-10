import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Admin {

  private apiUrl =
    'https://placement-platform-backend-production.up.railway.app/api/admin';

  constructor(private http: HttpClient) {}

  // ==========================================
  // ADMIN DASHBOARD
  // ==========================================

  getDashboardStatistics(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/dashboard`
    );
  }


  // ==========================================
  // GET ALL STUDENTS
  // ==========================================

  getAllStudents(): Observable<any[]> {
    return this.http.get<any[]>(
      'https://placement-platform-backend-production.up.railway.app/api/users/students'
    );
  }


  // ==========================================
  // GET ALL COMPANIES
  // ==========================================

  getAllCompanies(): Observable<any[]> {
    return this.http.get<any[]>(
      'https://placement-platform-backend-production.up.railway.app/api/users/companies'
    );
  }


  // ==========================================
  // DELETE COMPANY
  // ==========================================

  deleteCompany(userId: number): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}/companies/${userId}`
    );
  }


  // ==========================================
  // GET ALL JOBS
  // ==========================================

  getAllJobs(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/jobs`
    );
  }


  // ==========================================
  // ADD JOB
  // ==========================================

  addJob(job: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/jobs`,
      job
    );
  }


  // ==========================================
  // DELETE JOB
  // ==========================================

  deleteJob(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/jobs/${id}`
    );
  }


  // ==========================================
  // GET ALL APPLICATIONS
  // ==========================================

  getAllApplications(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/applications`
    );
  }


  // ==========================================
  // UPDATE APPLICATION STATUS
  // ==========================================

  updateApplicationStatus(
    id: number,
    status: string
  ): Observable<any> {

    return this.http.put<any>(
      `${this.apiUrl}/applications/${id}/status`,
      null,
      {
        params: {
          status: status
        }
      }
    );
  }

}