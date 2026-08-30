import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Job {

  private apiUrl = 'http://localhost:8080/api/jobs';

  constructor(private http: HttpClient) {}

  // Get all jobs
  getJobs(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Get one job by ID
  getJobById(id: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/${id}`
    );
  }
}