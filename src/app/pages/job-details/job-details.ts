import {
  Component,
  ChangeDetectorRef,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import { Job } from '../../services/job';
import { Application } from '../../services/application';

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './job-details.html',
  styleUrl: './job-details.css'
})
export class JobDetails implements OnInit {

  // ==========================================
  // VARIABLES
  // ==========================================

  job: any = null;

  loading: boolean = true;

  applying: boolean = false;

  message: string = '';

  messageType: string = '';


  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: Job,
    private applicationService: Application,
    private cdr: ChangeDetectorRef
  ) {}


  // ==========================================
  // INITIALIZE
  // ==========================================

  ngOnInit(): void {

    const jobId =
      this.route.snapshot.paramMap.get('id');


    if (!jobId) {

      this.message =
        'Job ID not found.';

      this.messageType =
        'error';

      this.loading = false;

      this.cdr.detectChanges();

      return;
    }


    this.loadJob(
      Number(jobId)
    );
  }


  // ==========================================
  // LOAD JOB
  // ==========================================

  loadJob(id: number): void {

    this.loading = true;

    this.message = '';


    this.jobService
      .getJobById(id)
      .subscribe({

        // ================================
        // SUCCESS
        // ================================

        next: (response: any) => {

          console.log(
            'Job details:',
            response
          );

          this.job = response;

          this.loading = false;

          this.cdr.detectChanges();
        },


        // ================================
        // ERROR
        // ================================

        error: (error: any) => {

          console.error(
            'Job details error:',
            error
          );

          this.message =
            'Unable to load job details.';

          this.messageType =
            'error';

          this.loading = false;

          this.cdr.detectChanges();
        }

      });
  }


  // ==========================================
  // APPLY NOW
  // ==========================================

  applyNow(): void {

    // Job check
    if (
      !this.job ||
      !this.job.id
    ) {

      this.message =
        'Job information is not available.';

      this.messageType =
        'error';

      return;
    }


    // Get student ID
    const studentId =
      this.getStudentIdFromToken();


    // Student check
    if (!studentId) {

      this.message =
        'Student information not found. Please login again.';

      this.messageType =
        'error';

      this.cdr.detectChanges();

      return;
    }


    // Prevent multiple clicks
    if (this.applying) {

      return;
    }


    this.applying = true;

    this.message = '';

    this.messageType = '';

    this.cdr.detectChanges();


    console.log(
      '================================'
    );

    console.log(
      'Applying for job'
    );

    console.log(
      'Student ID:',
      studentId
    );

    console.log(
      'Job ID:',
      this.job.id
    );

    console.log(
      '================================'
    );


    // ======================================
    // API CALL
    // ======================================

    this.applicationService
      .apply(
        studentId,
        this.job.id
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


          this.applying = false;

          this.message =
            'Application submitted successfully!';

          this.messageType =
            'success';

          this.cdr.detectChanges();


          // Go to My Applications
          setTimeout(() => {

            this.router.navigate([
              '/applications'
            ]);

          }, 1000);

        },


        // ==================================
        // ERROR
        // ==================================

        error: (error: any) => {

          console.error(
            'Application error:',
            error
          );


          this.applying = false;


          // ----------------------------------
          // Backend returned STRING
          // ----------------------------------

          if (
            typeof error?.error ===
            'string'
          ) {

            this.message =
              error.error;

          }


          // ----------------------------------
          // Backend returned JSON
          // ----------------------------------

          else if (
            error?.error?.message
          ) {

            this.message =
              error.error.message;

          }


          // ----------------------------------
          // Unknown error
          // ----------------------------------

          else {

            this.message =
              'Unable to submit application.';
          }


          this.messageType =
            'error';

          this.cdr.detectChanges();

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

      const parts =
        token.split('.');


      if (
        parts.length !== 3
      ) {

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


      console.error(
        'userId not found in JWT.'
      );

      return null;

    } catch (error) {

      console.error(
        'Unable to read JWT:',
        error
      );

      return null;
    }
  }

}