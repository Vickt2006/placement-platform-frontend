import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Application {

  private apiUrl = 'https://placement-platform-backend-production.up.railway.app/api/applications';

  constructor(
    private http: HttpClient
  ) {}

  // APPLY FOR JOB
  apply(
    studentId: number,
    jobId: number
  ): Observable<any> {

    return this.http.post<any>(
      this.apiUrl,
      {
        studentId: studentId,
        jobId: jobId
      }
    );
  }

  // GET ALL APPLICATIONS
  getAllApplications(): Observable<any[]> {

    return this.http.get<any[]>(
      this.apiUrl
    );
  }

  // GET APPLICATIONS BY STUDENT
  getApplicationsByStudent(
    studentId: number
  ): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.apiUrl}/student/${studentId}`
    );
  }

  // GET APPLICATIONS BY JOB
  getApplicationsByJob(
    jobId: number
  ): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.apiUrl}/job/${jobId}`
    );
  }

  // GET APPLICATION BY ID
  getApplicationById(
    id: number
  ): Observable<any> {

    return this.http.get<any>(
      `${this.apiUrl}/${id}`
    );
  }

  // UPDATE APPLICATION
  updateApplication(
    id: number,
    application: any
  ): Observable<any> {

    return this.http.put<any>(
      `${this.apiUrl}/${id}`,
      application
    );
  }

  // UPDATE APPLICATION STATUS
  updateApplicationStatus(
    id: number,
    status: string
  ): Observable<any> {

    return this.http.put<any>(
      `${this.apiUrl}/${id}`,
      {
        status: status
      }
    );
  }
}