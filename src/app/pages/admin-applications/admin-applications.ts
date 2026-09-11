import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  finalize
} from 'rxjs/operators';

import {
  Admin
} from '../../services/admin';


@Component({
  selector: 'app-admin-applications',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './admin-applications.html',

  styleUrl: './admin-applications.css'
})
export class AdminApplications
  implements OnInit {


  // ==========================================
  // VARIABLES
  // ==========================================

  applications: any[] = [];

  loading = false;

  message = '';

  updatingApplicationId:
    number | null = null;

  deletingApplicationId:
    number | null = null;


  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor(
    private adminService: Admin,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}


  // ==========================================
  // INITIAL LOAD
  // ==========================================

  ngOnInit(): void {

    this.loadApplications();

  }


  // ==========================================
  // LOAD ALL APPLICATIONS
  // ==========================================

  loadApplications(): void {

    this.loading = true;

    this.message = '';

    this.cdr.detectChanges();


    this.adminService
      .getAllApplications()
      .pipe(

        finalize(() => {

          this.loading = false;

          this.cdr.detectChanges();

        })

      )
      .subscribe({

        next: (data: any[]) => {

          console.log(
            'ADMIN APPLICATIONS:',
            data
          );


          this.applications =
            Array.isArray(data)
              ? data
              : [];


          this.cdr.detectChanges();

        },


        error: (error: any) => {

          console.error(
            'ADMIN APPLICATION ERROR:',
            error
          );


          this.applications = [];


          if (error?.status === 401) {

            this.message =
              'Unauthorized. Please login again.';

          }

          else if (error?.status === 403) {

            this.message =
              'You do not have permission to view applications.';

          }

          else {

            this.message =
              'Unable to load applications.';

          }


          this.cdr.detectChanges();

        }

      });

  }


  // ==========================================
  // UPDATE APPLICATION STATUS
  // ==========================================

  updateStatus(
    application: any,
    event: Event
  ): void {

    const select =
      event.target as HTMLSelectElement;


    const newStatus =
      select.value;


    if (
      !application?.id ||
      !newStatus
    ) {

      return;
    }


    const oldStatus =
      application.status;


    this.updatingApplicationId =
      application.id;

    this.message = '';

    this.cdr.detectChanges();


    this.adminService
      .updateApplicationStatus(
        application.id,
        newStatus
      )
      .subscribe({

        next: (updated: any) => {

          console.log(
            'STATUS UPDATED:',
            updated
          );


          const index =
            this.applications.findIndex(
              item =>
                item.id === application.id
            );


          if (index !== -1) {

            this.applications[index] =
              {
                ...this.applications[index],
                ...updated
              };

          }


          this.updatingApplicationId =
            null;


          this.cdr.detectChanges();

        },


        error: (error: any) => {

          console.error(
            'STATUS UPDATE ERROR:',
            error
          );


          application.status =
            oldStatus;


          this.updatingApplicationId =
            null;


          this.message =
            'Unable to update application status.';


          this.cdr.detectChanges();

        }

      });

  }


  // ==========================================
  // DELETE APPLICATION
  // ==========================================

  deleteApplication(
    application: any
  ): void {

    if (!application?.id) {

      return;
    }


    const studentName =
      application.studentName ||
      application.student?.name ||
      `Student #${application.studentId}`;


    const jobTitle =
      application.jobTitle ||
      application.job?.title ||
      'this job';


    const confirmed =
      window.confirm(
        `Delete application #${application.id}?\n\n` +
        `${studentName} applied for ${jobTitle}.\n\n` +
        `This action cannot be undone.`
      );


    if (!confirmed) {

      return;
    }


    this.deletingApplicationId =
      application.id;

    this.message = '';

    this.cdr.detectChanges();


    this.adminService
      .deleteApplication(
        application.id
      )
      .subscribe({

        next: () => {

          console.log(
            'APPLICATION DELETED:',
            application.id
          );


          this.applications =
            this.applications.filter(
              item =>
                item.id !== application.id
            );


          this.deletingApplicationId =
            null;


          this.cdr.detectChanges();

        },


        error: (error: any) => {

          console.error(
            'DELETE APPLICATION ERROR:',
            error
          );


          this.deletingApplicationId =
            null;


          if (error?.status === 404) {

            this.message =
              'Application not found. It may already be deleted.';

          }

          else if (error?.status === 401) {

            this.message =
              'Unauthorized. Please login again.';

          }

          else if (error?.status === 403) {

            this.message =
              'You do not have permission to delete applications.';

          }

          else {

            this.message =
              'Unable to delete application.';

          }


          this.cdr.detectChanges();

        }

      });

  }


  // ==========================================
  // STATUS LABEL
  // ==========================================

  getStatusLabel(
    status: string
  ): string {

    if (!status) {

      return 'Applied';
    }


    switch (
      status.toUpperCase()
    ) {

      case 'APPLIED':
        return 'Applied';

      case 'UNDER_REVIEW':
        return 'Under Review';

      case 'SHORTLISTED':
        return 'Shortlisted';

      case 'SELECTED':
        return 'Selected';

      case 'REJECTED':
        return 'Rejected';

      default:
        return status;

    }

  }


  // ==========================================
  // STATUS CSS CLASS
  // ==========================================

  getStatusClass(
    status: string
  ): string {

    if (!status) {

      return 'applied';
    }


    return status
      .toLowerCase()
      .replace(/_/g, '-');

  }


  // ==========================================
  // FORMAT DATE
  // ==========================================

  formatAppliedDate(
    dateValue: any
  ): string {

    if (!dateValue) {

      return 'N/A';
    }


    const date =
      new Date(dateValue);


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return 'N/A';
    }


    return date.toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    )
    +
    ' • '
    +
    date.toLocaleTimeString(
      'en-IN',
      {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }
    );

  }


  // ==========================================
  // REFRESH
  // ==========================================

  refreshApplications(): void {

    this.loadApplications();

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