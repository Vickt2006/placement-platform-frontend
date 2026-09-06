import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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
  // API
  // ==========================================

  private companyApi =
    'https://placement-platform-backend-production.up.railway.app/api/companies';


  // ==========================================
  // COMPANY
  // ==========================================

  companyId: number | null = null;

  companyName = 'Company';

  companyEmail = '';

  companyLocation = '';

  companyWebsite = '';

  companyDescription = '';


  // ==========================================
  // DATA
  // ==========================================

  jobs: any[] = [];

  applications: any[] = [];


  // ==========================================
  // STATISTICS
  // ==========================================

  totalJobs = 0;

  totalApplications = 0;

  pendingApplications = 0;

  shortlistedApplications = 0;

  selectedApplications = 0;

  rejectedApplications = 0;


  // ==========================================
  // UI
  // ==========================================

  loading = false;

  updating = false;

  message = '';

  successMessage = '';


  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor(
    private http: HttpClient,
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
  // LOAD COMPANY DASHBOARD
  // ==========================================

  loadCompanyDashboard(): void {

    this.loading = true;

    this.message = '';

    this.successMessage = '';


    this.http
      .get<any>(
        `${this.companyApi}/my/dashboard`
      )
      .subscribe({

        // ====================================
        // SUCCESS
        // ====================================

        next: (data: any) => {

          console.log(
            'COMPANY DASHBOARD DATA:',
            data
          );


          // ==================================
          // COMPANY
          // ==================================

          const company =
            data?.company || null;


          if (company) {

            this.companyId =
              company.id ?? null;

            this.companyName =
              company.name || 'Company';

            this.companyEmail =
              company.user?.email ||
              company.email ||
              '';

            this.companyLocation =
              company.location ||
              '';

            this.companyWebsite =
              company.website ||
              '';

            this.companyDescription =
              company.description ||
              '';

          }


          // ==================================
          // JOBS
          // ==================================

          this.jobs =
            Array.isArray(data?.jobs)
              ? data.jobs
              : [];


          // ==================================
          // APPLICATIONS
          // ==================================

          this.applications =
            Array.isArray(data?.applications)
              ? data.applications
              : [];


          // ==================================
          // STATISTICS
          // ==================================

          this.calculateStatistics();


          this.loading = false;

          this.cdr.detectChanges();

        },


        // ====================================
        // ERROR
        // ====================================

        error: (error: any) => {

          console.error(
            'COMPANY DASHBOARD ERROR:',
            error
          );


          this.loading = false;


          if (error?.status === 401) {

            this.message =
              'Session expired. Please login again.';

          }

          else if (error?.status === 403) {

            this.message =
              'You do not have permission to access the company dashboard.';

          }

          else if (error?.status === 404) {

            this.message =
              'Company profile not found. Please create your company profile first.';

          }

          else {

            this.message =
              'Unable to load company dashboard.';

          }


          this.cdr.detectChanges();

        }

      });

  }


  // ==========================================
  // REFRESH
  // ==========================================

  refreshApplications(): void {

    this.loadCompanyDashboard();

  }


  // ==========================================
  // STATISTICS
  // ==========================================

  calculateStatistics(): void {

    this.totalJobs =
      this.jobs.length;


    this.totalApplications =
      this.applications.length;


    this.pendingApplications =
      this.applications.filter(
        (application: any) => {

          const status =
            this.getStatusClass(
              application?.status
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
            application?.status
          ) === 'shortlisted';

        }
      ).length;


    this.selectedApplications =
      this.applications.filter(
        (application: any) => {

          return this.getStatusClass(
            application?.status
          ) === 'selected';

        }
      ).length;


    this.rejectedApplications =
      this.applications.filter(
        (application: any) => {

          return this.getStatusClass(
            application?.status
          ) === 'rejected';

        }
      ).length;

  }


  // ==========================================
  // STAT GETTERS
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

    if (application?.studentId != null) {

      return application.studentId;

    }


    if (application?.student?.id != null) {

      return application.student.id;

    }


    return 'N/A';

  }


  // ==========================================
  // STUDENT NAME
  // ==========================================

  getStudentName(
    application: any
  ): string {

    if (application?.studentName) {

      return application.studentName;

    }


    if (application?.student?.name) {

      return application.student.name;

    }


    return `Student #${this.getStudentId(application)}`;

  }


  // ==========================================
  // STUDENT EMAIL
  // ==========================================

  getStudentEmail(
    application: any
  ): string {

    if (application?.studentEmail) {

      return application.studentEmail;

    }


    if (application?.student?.email) {

      return application.student.email;

    }


    return 'Email not available';

  }


  // ==========================================
  // JOB TITLE
  // ==========================================

  getJobTitle(
    application: any
  ): string {

    if (application?.jobTitle) {

      return application.jobTitle;

    }


    if (application?.job?.title) {

      return application.job.title;

    }


    const job =
      this.jobs.find(
        (item: any) => {

          return Number(item?.id) ===
            Number(application?.jobId);

        }
      );


    if (job) {

      return job.title || 'Unknown Job';

    }


    return 'Unknown Job';

  }


  // ==========================================
  // JOB LOCATION
  // ==========================================

  getJobLocation(
    application: any
  ): string {

    if (application?.location) {

      return application.location;

    }


    if (application?.job?.location) {

      return application.job.location;

    }


    const job =
      this.jobs.find(
        (item: any) => {

          return Number(item?.id) ===
            Number(application?.jobId);

        }
      );


    if (job?.location) {

      return job.location;

    }


    return 'Location not available';

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

    }

    catch {

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
      .replace(/_/g, '-')
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

    if (
      !application ||
      !application.id ||
      !status
    ) {

      return;

    }


    const oldStatus =
      application.status;


    if (
      String(oldStatus).toUpperCase() ===
      String(status).toUpperCase()
    ) {

      return;

    }


    this.updating = true;

    this.message = '';

    this.successMessage = '';


    this.applicationService
      .updateApplicationStatus(
        Number(application.id),
        status
      )
      .subscribe({

        // ==================================
        // SUCCESS
        // ==================================

        next: (updatedApplication: any) => {

          console.log(
            'APPLICATION STATUS UPDATED:',
            updatedApplication
          );


          application.status =
            updatedApplication?.status ||
            status;


          this.calculateStatistics();


          this.updating = false;

          this.successMessage =
            'Application status updated successfully.';


          this.cdr.detectChanges();


          // Automatically hide message
          setTimeout(() => {

            this.successMessage = '';

            this.cdr.detectChanges();

          }, 3000);

        },


        // ==================================
        // ERROR
        // ==================================

        error: (error: any) => {

          console.error(
            'STATUS UPDATE ERROR:',
            error
          );


          application.status =
            oldStatus;


          this.updating = false;


          if (error?.status === 403) {

            this.message =
              'You do not have permission to update this application.';

          }

          else if (error?.status === 404) {

            this.message =
              'Application not found.';

          }

          else {

            this.message =
              'Unable to update application status.';

          }


          this.cdr.detectChanges();

        }

      });

  }


  // ==========================================
  // LOGOUT
  // ==========================================

  logout(): void {

    localStorage.removeItem('token');

    this.router.navigate([
      '/login'
    ]);

  }

}