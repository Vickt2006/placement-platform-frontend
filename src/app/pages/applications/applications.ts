import {
  Component,
  ChangeDetectorRef,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Application } from '../../services/application';


@Component({
  selector: 'app-applications',
  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './applications.html',
  styleUrl: './applications.css'
})
export class Applications implements OnInit {


  // ==========================================
  // VARIABLES
  // ==========================================

  applications: any[] = [];

  loading = true;

  message = '';


  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor(
    private applicationService: Application,
    private cdr: ChangeDetectorRef
  ) {}


  // ==========================================
  // INITIALIZATION
  // ==========================================

  ngOnInit(): void {

    console.log(
      'MY APPLICATIONS PAGE OPENED'
    );

    this.loadApplications();

  }


  // ==========================================
  // LOAD APPLICATIONS
  // ==========================================

  loadApplications(): void {

    this.loading = true;

    this.message = '';


    const studentId =
      this.getStudentIdFromToken();


    console.log(
      'Student ID:',
      studentId
    );


    if (!studentId) {

      this.loading = false;

      this.message =
        'Student information not found. Please login again.';

      this.cdr.detectChanges();

      return;
    }


    console.log(
      'Loading applications for student:',
      studentId
    );


    this.applicationService
      .getApplicationsByStudent(studentId)
      .subscribe({

        // ======================================
        // SUCCESS
        // ======================================

        next: (response: any[]) => {

          console.log(
            'APPLICATIONS API RESPONSE:',
            response
          );


          this.applications =
            response || [];


          this.loading = false;


          this.cdr.detectChanges();


          console.log(
            'Applications loaded:',
            this.applications
          );

        },


        // ======================================
        // ERROR
        // ======================================

        error: (error: any) => {

          console.error(
            'APPLICATIONS API ERROR:',
            error
          );


          this.applications = [];


          this.loading = false;


          if (error.status === 401) {

            this.message =
              'Your login session has expired. Please login again.';

          }

          else if (error.status === 403) {

            this.message =
              'You are not authorized to view your applications.';

          }

          else if (error.status === 404) {

            this.message =
              'Applications API endpoint not found.';

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
  // GET STUDENT ID FROM JWT
  // ==========================================

  getStudentIdFromToken(): number | null {

    const token =
      localStorage.getItem('token');


    console.log(
      'Token exists:',
      !!token
    );


    if (!token) {

      console.error(
        'JWT token not found.'
      );

      return null;
    }


    try {

      const parts =
        token.split('.');


      if (parts.length !== 3) {

        console.error(
          'Invalid JWT token.'
        );

        return null;
      }


      let payload =
        parts[1];


      // JWT Base64URL → Base64

      payload =
        payload
          .replace(/-/g, '+')
          .replace(/_/g, '/');


      while (
        payload.length % 4 !== 0
      ) {

        payload += '=';

      }


      const decodedPayload =
        JSON.parse(
          atob(payload)
        );


      console.log(
        'JWT Payload:',
        decodedPayload
      );


      // ======================================
      // USER ID
      // ======================================

      const userId =
        decodedPayload.userId ??
        decodedPayload.id ??
        decodedPayload.sub;


      if (
        userId === undefined ||
        userId === null
      ) {

        console.error(
          'User ID not found in JWT.'
        );

        return null;
      }


      const id =
        Number(userId);


      if (Number.isNaN(id)) {

        console.error(
          'Invalid User ID:',
          userId
        );

        return null;
      }


      return id;

    }

    catch (error) {

      console.error(
        'Unable to decode JWT:',
        error
      );


      return null;

    }

  }


  // ==========================================
  // STATUS CLASS
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
  // CHECK TIMELINE STEP
  // ==========================================

  isStepActive(
    currentStatus: string,
    step: string
  ): boolean {

    const order = [

      'APPLIED',

      'UNDER_REVIEW',

      'SHORTLISTED',

      'SELECTED'

    ];


    const current =
      order.indexOf(
        currentStatus?.toUpperCase()
      );


    const currentStep =
      order.indexOf(
        step.toUpperCase()
      );


    // ========================================
    // REJECTED
    // ========================================

    if (
      currentStatus?.toUpperCase() ===
      'REJECTED'
    ) {

      return (
        step.toUpperCase() === 'APPLIED' ||
        step.toUpperCase() === 'UNDER_REVIEW'
      );

    }


    // ========================================
    // NORMAL STATUS
    // ========================================

    return (
      current >= currentStep &&
      currentStep !== -1
    );

  }


  // ==========================================
  // CHECK REJECTED
  // ==========================================

  isRejected(
    status: string
  ): boolean {

    return (
      status?.toUpperCase() ===
      'REJECTED'
    );

  }


  // ==========================================
  // CHECK SELECTED
  // ==========================================

  isSelected(
    status: string
  ): boolean {

    return (
      status?.toUpperCase() ===
      'SELECTED'
    );

  }

}