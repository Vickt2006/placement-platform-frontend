import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Application {

  private apiUrl = 'http://localhost:8080/api/applications';

  constructor(
    private http: HttpClient
  ) {}

  // ==========================================
  // APPLY FOR JOB
  // ==========================================

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


  // ==========================================
  // GET ALL APPLICATIONS OF STUDENT
  // ==========================================

  getApplicationsByStudent(
    studentId: number
  ): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.apiUrl}/student/${studentId}`
    );
  }


  // ==========================================
  // GET APPLICATION BY ID
  // ==========================================

  getApplicationById(
    id: number
  ): Observable<any> {

    return this.http.get<any>(
      `${this.apiUrl}/${id}`
    );
  }

}