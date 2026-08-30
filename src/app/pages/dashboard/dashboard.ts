import {
  Component,
  ChangeDetectorRef,
  OnInit
} from '@angular/core';

import {
  RouterLink,
  Router
} from '@angular/router';

import { FormsModule } from '@angular/forms';

import { Job } from '../../services/job';
import { Application } from '../../services/application';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  // ==========================================
  // VARIABLES
  // ==========================================

  jobs: any[] = [];

  filteredJobs: any[] = [];

  loading: boolean = true;

  message: string = '';

  searchText: string = '';


  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor(
    private jobService: Job,
    private applicationService: Application,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}


  // ==========================================
  // INITIALIZE
  // ==========================================

  ngOnInit(): void {

    this.loadJobs();
  }


  // ==========================================
  // LOAD JOBS
  // ==========================================

  loadJobs(): void {

    this.loading = true;

    this.message = '';

    this.jobService
      .getJobs()
      .subscribe({

        next: (response: any[]) => {

          console.log(
            'Jobs loaded:',
            response
          );

          this.jobs = response;

          this.filteredJobs = response;

          this.loading = false;

          this.cdr.detectChanges();
        },

        error: (error: any) => {

          console.error(
            'Jobs loading error:',
            error
          );

          this.message =
            'Unable to load jobs.';

          this.loading = false;

          this.cdr.detectChanges();
        }

      });
  }


  // ==========================================
  // SEARCH JOBS
  // ==========================================

  searchJobs(): void {

    const search =
      this.searchText
        .trim()
        .toLowerCase();


    // Empty search
    if (!search) {

      this.filteredJobs =
        this.jobs;

      return;
    }


    this.filteredJobs =
      this.jobs.filter(
        (job: any) => {

          const title =
            job.title
              ?.toLowerCase() || '';

          const skills =
            job.skills
              ?.toLowerCase() || '';

          const location =
            job.location
              ?.toLowerCase() || '';

          const jobType =
            job.jobType
              ?.toLowerCase() || '';


          return (
            title.includes(search) ||
            skills.includes(search) ||
            location.includes(search) ||
            jobType.includes(search)
          );

        }
      );
  }


  // ==========================================
  // APPLY FOR JOB
  // ==========================================

  applyForJob(
    jobId: number
  ): void {

    const studentId =
      this.getStudentIdFromToken();


    // Student not logged in
    if (!studentId) {

      alert(
        'Please login again.'
      );

      this.router.navigate([
        '/login'
      ]);

      return;
    }


    console.log(
      'Applying for job:',
      jobId
    );

    console.log(
      'Student ID:',
      studentId
    );


    // Call backend
    this.applicationService
      .apply(
        studentId,
        jobId
      )
      .subscribe({

        // ==================================
        // SUCCESS
        // ==================================

        next: (response: any) => {

          console.log(
            'Application successful:',
            response
          );

          alert(
            'Application submitted successfully!'
          );

          this.router.navigate([
            '/applications'
          ]);
        },


        // ==================================
        // ERROR
        // ==================================

        error: (error: any) => {

          console.error(
            'Application error:',
            error
          );


          // Backend returned text
          if (
            typeof error?.error ===
            'string'
          ) {

            alert(
              error.error
            );

            return;
          }


          // Backend returned JSON
          if (
            error?.error?.message
          ) {

            alert(
              error.error.message
            );

            return;
          }


          // Default error
          alert(
            'Unable to submit application.'
          );
        }

      });
  }


  // ==========================================
  // GET STUDENT ID FROM JWT
  // ==========================================

  getStudentIdFromToken():
    number | null {

    const token =
      localStorage.getItem('token');


    if (!token) {

      console.error(
        'JWT token not found.'
      );

      return null;
    }


    try {

      const payload =
        token.split('.')[1];


      const decodedPayload =
        JSON.parse(
          atob(payload)
        );


      console.log(
        'JWT payload:',
        decodedPayload
      );


      if (
        decodedPayload.userId
      ) {

        return Number(
          decodedPayload.userId
        );
      }


      return null;

    } catch (error) {

      console.error(
        'JWT decode error:',
        error
      );

      return null;
    }
  }


  // ==========================================
  // LOGOUT
  // ==========================================

  logout(): void {

    localStorage.removeItem(
      'token'
    );

    this.router.navigate([
      '/login'
    ]);
  }

}