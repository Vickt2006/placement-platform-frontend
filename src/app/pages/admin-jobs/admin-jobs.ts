import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import {
  Router,
  RouterLink
} from '@angular/router';

import { finalize } from 'rxjs/operators';

import { Admin } from '../../services/admin';


@Component({
  selector: 'app-admin-jobs',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],

  templateUrl: './admin-jobs.html',

  styleUrl: './admin-jobs.css'
})


export class AdminJobs implements OnInit {


  // ==========================================
  // JOBS
  // ==========================================

  jobs: any[] = [];


  // ==========================================
  // LOADING
  // ==========================================

  loading: boolean = false;


  // ==========================================
  // ADD JOB
  // ==========================================

  addingJob: boolean = false;

  showAddJobForm: boolean = false;

  addJobMessage: string = '';


  // ==========================================
  // GENERAL MESSAGE
  // ==========================================

  message: string = '';


  // ==========================================
  // DELETE JOB
  // ==========================================

  deletingJobId: number | null = null;


  // ==========================================
  // NEW JOB
  // ==========================================

  newJob: any = {

    title: '',

    description: '',

    location: '',

    skills: '',

    salary: null,

    jobType: '',

    companyId: null

  };


  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor(
    private adminService: Admin,
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

    this.cdr.detectChanges();


    this.adminService
      .getAllJobs()

      .pipe(

        finalize(() => {

          this.loading = false;

          this.cdr.detectChanges();

        })

      )

      .subscribe({

        next: (data: any[]) => {

          if (Array.isArray(data)) {

            this.jobs = data;

          } else {

            this.jobs = [];

          }

          this.cdr.detectChanges();

        },


        error: (error: any) => {

          console.error(
            'ADMIN JOBS API ERROR:',
            error
          );


          this.jobs = [];


          if (error?.status === 401) {

            this.message =
              'Unauthorized. Please login again.';

          }

          else if (error?.status === 403) {

            this.message =
              'You do not have permission to manage jobs.';

          }

          else if (error?.status === 404) {

            this.message =
              'Jobs endpoint not found.';

          }

          else {

            this.message =
              'Unable to load jobs.';

          }


          this.cdr.detectChanges();

        }

      });

  }


  // ==========================================
  // OPEN ADD JOB FORM
  // ==========================================

  openAddJobForm(): void {

    this.showAddJobForm = true;

    this.addJobMessage = '';

    this.message = '';

    this.cdr.detectChanges();

  }


  // ==========================================
  // CLOSE ADD JOB FORM
  // ==========================================

  closeAddJobForm(): void {

    this.showAddJobForm = false;

    this.addJobMessage = '';

    this.resetNewJob();

    this.cdr.detectChanges();

  }


  // ==========================================
  // RESET JOB FORM
  // ==========================================

  resetNewJob(): void {

    this.newJob = {

      title: '',

      description: '',

      location: '',

      skills: '',

      salary: null,

      jobType: '',

      companyId: null

    };

  }


  // ==========================================
  // ADD NEW JOB
  // ==========================================

  addJob(): void {

    this.addJobMessage = '';


    // ========================================
    // VALIDATION
    // ========================================

    if (
      !this.newJob.title ||
      !this.newJob.title.trim()
    ) {

      this.addJobMessage =
        'Please enter job title.';

      return;

    }


    if (
      !this.newJob.description ||
      !this.newJob.description.trim()
    ) {

      this.addJobMessage =
        'Please enter job description.';

      return;

    }


    if (
      !this.newJob.location ||
      !this.newJob.location.trim()
    ) {

      this.addJobMessage =
        'Please enter job location.';

      return;

    }


    if (
      !this.newJob.skills ||
      !this.newJob.skills.trim()
    ) {

      this.addJobMessage =
        'Please enter required skills.';

      return;

    }


    if (
      !this.newJob.jobType ||
      !this.newJob.jobType.trim()
    ) {

      this.addJobMessage =
        'Please select job type.';

      return;

    }


    // ========================================
    // START REQUEST
    // ========================================

    this.addingJob = true;

    this.addJobMessage = '';

    this.cdr.detectChanges();


    // ========================================
    // PREPARE JOB
    // ========================================

    const job = {

      title:
        this.newJob.title.trim(),

      description:
        this.newJob.description.trim(),

      location:
        this.newJob.location.trim(),

      skills:
        this.newJob.skills.trim(),

      salary:
        this.newJob.salary !== null &&
        this.newJob.salary !== ''
          ? Number(this.newJob.salary)
          : null,

      jobType:
        this.newJob.jobType.trim(),

      companyId:
        this.newJob.companyId !== null &&
        this.newJob.companyId !== ''
          ? Number(this.newJob.companyId)
          : null

    };


    console.log(
      'Adding new job:',
      job
    );


    // ========================================
    // BACKEND REQUEST
    // ========================================

    this.adminService
      .addJob(job)

      .subscribe({

        // ====================================
        // SUCCESS
        // ====================================

        next: (response: any) => {

          console.log(
            'JOB CREATED SUCCESSFULLY:',
            response
          );


          this.addingJob = false;


          this.addJobMessage =
            'Job added successfully!';


          // Add new job at top of list

          if (response) {

            this.jobs = [
              response,
              ...this.jobs
            ];

          }


          this.resetNewJob();

          this.cdr.detectChanges();


          // Close form after success

          setTimeout(() => {

            this.showAddJobForm = false;

            this.addJobMessage = '';

            this.cdr.detectChanges();

          }, 1200);

        },


        // ====================================
        // ERROR
        // ====================================

        error: (error: any) => {

          console.error(
            'ADD JOB ERROR:',
            error
          );


          this.addingJob = false;


          if (error?.status === 401) {

            this.addJobMessage =
              'Unauthorized. Please login again.';

          }

          else if (error?.status === 403) {

            this.addJobMessage =
              'You do not have permission to add jobs.';

          }

          else if (error?.status === 400) {

            this.addJobMessage =
              'Invalid job details.';

          }

          else if (error?.status === 0) {

            this.addJobMessage =
              'Unable to connect to server.';

          }

          else if (
            typeof error?.error === 'string'
          ) {

            this.addJobMessage =
              error.error;

          }

          else {

            this.addJobMessage =
              'Unable to add job. Please try again.';

          }


          this.cdr.detectChanges();

        }

      });

  }


  // ==========================================
  // DELETE JOB
  // ==========================================

  deleteJob(job: any): void {

    if (!job?.id) {

      return;

    }


    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${job.title}"?`
      );


    if (!confirmed) {

      return;

    }


    this.deletingJobId = job.id;

    this.message = '';

    this.cdr.detectChanges();


    this.adminService
      .deleteJob(job.id)

      .subscribe({

        // ====================================
        // SUCCESS
        // ====================================

        next: () => {

          this.jobs =
            this.jobs.filter(
              item =>
                item.id !== job.id
            );


          this.deletingJobId = null;

          this.cdr.detectChanges();

        },


        // ====================================
        // ERROR
        // ====================================

        error: (error: any) => {

          console.error(
            'DELETE JOB ERROR:',
            error
          );


          this.deletingJobId = null;


          if (error?.status === 401) {

            this.message =
              'Unauthorized. Please login again.';

          }

          else if (error?.status === 403) {

            this.message =
              'You do not have permission to delete this job.';

          }

          else if (error?.status === 404) {

            this.message =
              'Job not found.';

          }

          else {

            this.message =
              'Unable to delete job.';

          }


          this.cdr.detectChanges();

        }

      });

  }


  // ==========================================
  // REFRESH
  // ==========================================

  refreshJobs(): void {

    this.loadJobs();

  }


  // ==========================================
  // LOGOUT
  // ==========================================

  logout(): void {

    localStorage.removeItem('token');

    this.router.navigate(['/login']);

  }

}