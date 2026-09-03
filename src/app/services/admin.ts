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

  getDashboardStatistics(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/dashboard`
    );
  }

  getAllStudents(): Observable<any[]> {
    return this.http.get<any[]>(
      'https://placement-platform-backend-production.up.railway.app/api/users/students'
    );
  }

  getAllCompanies(): Observable<any[]> {
    return this.http.get<any[]>(
      'https://placement-platform-backend-production.up.railway.app/api/users/companies'
    );
  }

  getAllJobs(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/jobs`
    );
  }

  addJob(job: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/jobs`,
      job
    );
  }

  deleteJob(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/jobs/${id}`
    );
  }

  getAllApplications(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/applications`
    );
  }

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