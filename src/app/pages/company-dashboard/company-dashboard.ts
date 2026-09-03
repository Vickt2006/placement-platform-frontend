import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { Job } from '../../services/job';
import { Application } from '../../services/application';

@Component({
  selector: 'app-company-dashboard',
  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './company-dashboard.html',
  styleUrl: './company-dashboard.css'
})
export class CompanyDashboard implements OnInit {

  // ==========================================
  // COMPANY
  // ==========================================

  companyId: number = 3;

  companyName: string = 'Company';


  // ==========================================
  // DATA
  // ==========================================

  jobs: any[] = [];

  applications: any[] = [];


  // ==========================================
  // STATISTICS
  // ==========================================

  totalApplications: number = 0;

  pendingApplications: number = 0;

  shortlistedApplications: number = 0;

  selectedApplications: number = 0;

  rejectedApplications: number = 0;


  // ==========================================
  // UI
  // ==========================================

  loading: boolean = false;

  updating: boolean = false;

  message: string = '';


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
  // INIT
  // ==========================================

  ngOnInit(): void {

    this.loadCompanyDashboard();

  }


  // ==========================================
  // LOAD DASHBOARD
  // ==========================================

  loadCompanyDashboard(): void {

    this.loading = true;

    this.message = '';

    // IMPORTANT:
    // First load jobs.
    // Then load applications.
    this.loadCompanyJobs();

  }


  // ==========================================
  // LOAD COMPANY JOBS
  // ==========================================

  loadCompanyJobs(): void {

    this.jobService
      .getJobsByCompany(this.companyId)
      .subscribe({

        next: (data: any[]) => {

          console.log(
            'Company Jobs:',
            data
          );

          this.jobs = data || [];

          // Jobs loaded successfully.
          // NOW load applications.
          this.loadCompanyApplications();

        },

        error: (error: any) => {

          console.error(
            'Unable to load company jobs:',
            error
          );

          this.message =
            'Unable to load company jobs.';

          this.loading = false;

          this.cdr.detectChanges();

        }

      });

  }


  // ==========================================
  // LOAD COMPANY APPLICATIONS
  // ==========================================

  loadCompanyApplications(): void {

    this.applicationService
      .getAllApplications()
      .subscribe({

        next: (data: any[]) => {

          console.log(
            'All Applications:',
            data
          );

          const allApplications =
            data || [];


          // Only applications belonging
          // to this company's jobs
          this.applications =
            allApplications.filter(
              (application: any) => {

                return this.jobs.some(
                  (job: any) => {

                    return Number(job.id) ===
                      Number(application.jobId);

                  }
                );

              }
            );


          console.log(
            'Company Applications:',
            this.applications
          );


          this.calculateStatistics();


          this.loading = false;

          this.cdr.detectChanges();

        },

        error: (error: any) => {

          console.error(
            'Unable to load applications:',
            error
          );

          this.message =
            'Unable to load applications.';

          this.loading = false;

          this.cdr.detectChanges();

        }

      });

  }


  // ==========================================
  // REFRESH
  // ==========================================

  refreshApplications(): void {

    this.message = '';

    this.loading = true;

    this.loadCompanyJobs();

  }


  // ==========================================
  // STATISTICS
  // ==========================================

  calculateStatistics(): void {

    this.totalApplications =
      this.applications.length;


    this.pendingApplications =
      this.applications.filter(
        (application: any) => {

          const status =
            this.getStatusClass(
              application.status
            );

          return (
            status === 'pending' ||
            status === 'applied' ||
            status === 'under-review'
          );

        }
      ).length;


    this.shortlistedApplications =
      this.applications.filter(
        (application: any) => {

          return this.getStatusClass(
            application.status
          ) === 'shortlisted';

        }
      ).length;


    this.selectedApplications =
      this.applications.filter(
        (application: any) => {

          return this.getStatusClass(
            application.status
          ) === 'selected';

        }
      ).length;


    this.rejectedApplications =
      this.applications.filter(
        (application: any) => {

          return this.getStatusClass(
            application.status
          ) === 'rejected';

        }
      ).length;

  }


  // ==========================================
  // GET TOTAL
  // ==========================================

  getTotalApplications(): number {

    return this.totalApplications;

  }


  getPendingApplications(): number {

    return this.pendingApplications;

  }


  getShortlistedApplications(): number {

    return this.shortlistedApplications;

  }


  getSelectedApplications(): number {

    return this.selectedApplications;

  }


  getRejectedApplications(): number {

    return this.rejectedApplications;

  }


  // ==========================================
  // STUDENT ID
  // ==========================================

  getStudentId(
    application: any
  ): any {

    if (application.studentId) {

      return application.studentId;

    }


    if (
      application.student &&
      application.student.id
    ) {

      return application.student.id;

    }


    return 'N/A';

  }


  // ==========================================
  // JOB TITLE
  // ==========================================

  getJobTitle(
    application: any
  ): string {

    if (application.jobTitle) {

      return application.jobTitle;

    }


    const job =
      this.jobs.find(
        (j: any) => {

          return Number(j.id) ===
            Number(application.jobId);

        }
      );


    if (job) {

      return job.title || 'Unknown Job';

    }


    return 'Unknown Job';

  }


  // ==========================================
  // FORMAT DATE
  // ==========================================

  formatDate(
    date: any
  ): string {

    if (!date) {

      return 'N/A';

    }


    try {

      return new Date(date)
        .toLocaleDateString(
          'en-IN',
          {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }
        );

    } catch {

      return 'N/A';

    }

  }


  // ==========================================
  // STATUS CLASS
  // ==========================================

  getStatusClass(
    status: any
  ): string {

    if (!status) {

      return 'pending';

    }


    return String(status)
      .toLowerCase()
      .replace('_', '-')
      .trim();

  }


  // ==========================================
  // STATUS LABEL
  // ==========================================

  getStatusLabel(
    status: any
  ): string {

    const value =
      this.getStatusClass(status);


    switch (value) {

      case 'applied':
        return 'Applied';

      case 'pending':
        return 'Pending';

      case 'under-review':
        return 'Under Review';

      case 'shortlisted':
        return 'Shortlisted';

      case 'selected':
        return 'Selected';

      case 'rejected':
        return 'Rejected';

      default:
        return 'Pending';

    }

  }


  // ==========================================
  // UPDATE APPLICATION STATUS
  // ==========================================

  updateApplicationStatus(
    application: any,
    status: string
  ): void {

    if (!application || !application.id) {

      console.error(
        'Invalid application'
      );

      return;

    }


    this.updating = true;

    this.message = '';


    this.applicationService
      .updateApplicationStatus(
        application.id,
        status
      )
      .subscribe({

        next: (updatedApplication: any) => {

          console.log(
            'Updated Application:',
            updatedApplication
          );


          const index =
            this.applications.findIndex(
              (item: any) => {

                return Number(item.id) ===
                  Number(application.id);

              }
            );


          if (index !== -1) {

            this.applications[index] =
              updatedApplication;

          }


          this.calculateStatistics();


          this.updating = false;

          this.cdr.detectChanges();

        },

        error: (error: any) => {

          console.error(
            'Unable to update application status:',
            error
          );


          this.message =
            'Unable to update application status.';


          this.updating = false;

          this.cdr.detectChanges();

        }

      });

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