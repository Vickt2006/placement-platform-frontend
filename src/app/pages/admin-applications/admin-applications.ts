import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { Admin } from '../../services/admin';


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
export class AdminApplications implements OnInit {

  applications: any[] = [];

  loading = false;

  message = '';

  updatingApplicationId: number | null = null;


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
              updated;

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

          this.updatingApplicationId =
            null;

          this.message =
            'Unable to update application status.';

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


    switch (status.toUpperCase()) {

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
      .replace('_', '-');

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

    localStorage.removeItem('token');

    this.router.navigate([
      '/login'
    ]);

  }

}