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

  loading: boolean = true;

  message: string = '';


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

      this.message =
        'Student information not found. Please login again.';

      this.loading = false;

      this.cdr.detectChanges();

      return;
    }


    this.applicationService
      .getApplicationsByStudent(studentId)

      .subscribe({

        // ====================================
        // SUCCESS
        // ====================================

        next: (response: any[]) => {

          console.log(
            'My Applications:',
            response
          );


          this.applications =
            response || [];


          this.loading = false;

          this.cdr.detectChanges();

        },


        // ====================================
        // ERROR
        // ====================================

        error: (error: any) => {

          console.error(
            'Applications Error:',
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
  // GET STUDENT ID FROM JWT TOKEN
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

      const parts =
        token.split('.');


      if (parts.length !== 3) {

        console.error(
          'Invalid JWT token.'
        );

        return null;
      }


      const payload =
        parts[1];


      const decodedPayload =
        JSON.parse(
          atob(payload)
        );


      console.log(
        'JWT Payload:',
        decodedPayload
      );


      if (
        decodedPayload.userId
      ) {

        return Number(
          decodedPayload.userId
        );

      }


      console.error(
        'userId not found in JWT.'
      );


      return null;

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
      .replace('_', '-');

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
      order.indexOf(step);


    if (
      currentStatus?.toUpperCase() ===
      'REJECTED'
    ) {

      return (
        step === 'APPLIED' ||
        step === 'UNDER_REVIEW'
      );

    }


    return current >= currentStep;

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