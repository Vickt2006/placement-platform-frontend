import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Job {

  private apiUrl =
    'https://placement-platform-backend-production.up.railway.app/api/jobs';

  constructor(
    private http: HttpClient
  ) {}

  // ==========================================
  // GET ALL JOBS
  // ==========================================

  getJobs(): Observable<any[]> {

    return this.http.get<any[]>(
      this.apiUrl
    );
  }

  // ==========================================
  // GET JOB BY ID
  // ==========================================

  getJobById(
    id: number
  ): Observable<any> {

    return this.http.get<any>(
      `${this.apiUrl}/${id}`
    );
  }

  // ==========================================
  // GET JOBS BY COMPANY
  // ==========================================

  getJobsByCompany(
    companyId: number
  ): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.apiUrl}/company/${companyId}`
    );
  }

  // ==========================================
  // CREATE JOB
  // ==========================================

  createJob(
    job: any
  ): Observable<any> {

    return this.http.post<any>(
      this.apiUrl,
      job
    );
  }

  // ==========================================
  // UPDATE JOB
  // ==========================================

  updateJob(
    id: number,
    job: any
  ): Observable<any> {

    return this.http.put<any>(
      `${this.apiUrl}/${id}`,
      job
    );
  }

  // ==========================================
  // DELETE JOB
  // ==========================================

  deleteJob(
    id: number
  ): Observable<any> {

    return this.http.delete<any>(
      `${this.apiUrl}/${id}`
    );
  }

  // ==========================================
  // SEARCH JOB
  // ==========================================

  searchJobs(
    keyword: string
  ): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.apiUrl}/search`,
      {
        params: {
          keyword: keyword
        }
      }
    );
  }

  // ==========================================
  // FILTER LOCATION
  // ==========================================

  filterByLocation(
    location: string
  ): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.apiUrl}/filter/location`,
      {
        params: {
          location: location
        }
      }
    );
  }

  // ==========================================
  // FILTER JOB TYPE
  // ==========================================

  filterByJobType(
    jobType: string
  ): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.apiUrl}/filter/type`,
      {
        params: {
          jobType: jobType
        }
      }
    );
  }

  // ==========================================
  // SEARCH BY SKILL
  // ==========================================

  searchJobsBySkill(
    skill: string
  ): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.apiUrl}/filter/skill`,
      {
        params: {
          skill: skill
        }
      }
    );
  }
}