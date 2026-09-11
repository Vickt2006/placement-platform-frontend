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

  job: any = null;

  loading: boolean = true;

  applying: boolean = false;

  applicationAnimation: boolean = false;

  message: string = '';

  messageType: string = '';


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: Job,
    private applicationService: Application,
    private cdr: ChangeDetectorRef
  ) {}


  // =====================================================
  // PAGE LOAD
  // =====================================================

  ngOnInit(): void {

    const jobId =
      this.route.snapshot.paramMap.get('id');


    if (!jobId) {

      this.message =
        'Job ID not found.';

      this.messageType =
        'error';

      this.loading =
        false;

      this.cdr.detectChanges();

      return;
    }


    this.loadJob(
      Number(jobId)
    );
  }


  // =====================================================
  // LOAD JOB
  // =====================================================

  loadJob(id: number): void {

    this.loading =
      true;

    this.message =
      '';

    this.messageType =
      '';


    this.jobService
      .getJobById(id)
      .subscribe({

        next: (response: any) => {

          console.log(
            'Job details:',
            response
          );


          this.job =
            response;

          this.loading =
            false;


          this.cdr.detectChanges();
        },


        error: (error: any) => {

          console.error(
            'Job details error:',
            error
          );


          this.job =
            null;

          this.message =
            'Unable to load job details.';

          this.messageType =
            'error';

          this.loading =
            false;


          this.cdr.detectChanges();
        }

      });
  }


  // =====================================================
  // APPLY NOW
  // =====================================================

  applyNow(): void {

    // ---------------------------------------------------
    // CHECK JOB
    // ---------------------------------------------------

    if (
      !this.job ||
      !this.job.id
    ) {

      this.message =
        'Job information is not available.';

      this.messageType =
        'error';

      this.cdr.detectChanges();

      return;
    }


    // ---------------------------------------------------
    // PREVENT DOUBLE CLICK
    // ---------------------------------------------------

    if (
      this.applying ||
      this.applicationAnimation
    ) {

      return;
    }


    // ---------------------------------------------------
    // GET STUDENT ID
    // ---------------------------------------------------

    const studentId =
      this.getStudentIdFromToken();


    if (!studentId) {

      this.message =
        'Student information not found. Please login again.';

      this.messageType =
        'error';

      this.cdr.detectChanges();

      return;
    }


    // ---------------------------------------------------
    // START LOADING
    // ---------------------------------------------------

    this.applying =
      true;

    this.message =
      '';

    this.messageType =
      '';


    this.cdr.detectChanges();


    console.log(
      '================================'
    );

    console.log(
      'APPLYING FOR JOB'
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


    // ---------------------------------------------------
    // SEND APPLICATION
    // ---------------------------------------------------

    this.applicationService
      .apply(
        studentId,
        this.job.id
      )
      .subscribe({

        // ===============================================
        // SUCCESS
        // ===============================================

        next: (response: any) => {

          console.log(
            'APPLICATION SUCCESS:',
            response
          );


          // Stop loading
          this.applying =
            false;


          // Start animation
          this.applicationAnimation =
            true;


          this.message =
            'Application submitted successfully!';

          this.messageType =
            'success';


          console.log(
            'ANIMATION STARTED:',
            this.applicationAnimation
          );


          this.cdr.detectChanges();


          // ------------------------------------------------
          // WAIT FOR ANIMATION
          // ------------------------------------------------

          setTimeout(() => {

            console.log(
              'Animation completed.'
            );


            this.applicationAnimation =
              false;


            this.cdr.detectChanges();


            this.router.navigate([
              '/applications'
            ]);

          }, 6000);

        },


        // ===============================================
        // ERROR
        // ===============================================

        error: (error: any) => {

          console.error(
            'APPLICATION ERROR:',
            error
          );


          this.applying =
            false;


          if (
            typeof error?.error === 'string'
          ) {

            this.message =
              error.error;

          }

          else if (
            error?.error?.message
          ) {

            this.message =
              error.error.message;

          }

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


  // =====================================================
  // GET STUDENT ID FROM JWT
  // =====================================================

  getStudentIdFromToken(): number | null {

    const token =
      localStorage.getItem('token');


    // ---------------------------------------------------
    // TOKEN CHECK
    // ---------------------------------------------------

    if (!token) {

      console.error(
        'JWT token not found.'
      );

      return null;
    }


    try {

      const parts =
        token.split('.');


      // -------------------------------------------------
      // JWT FORMAT CHECK
      // -------------------------------------------------

      if (
        parts.length !== 3
      ) {

        console.error(
          'Invalid JWT token.'
        );

        return null;
      }


      // -------------------------------------------------
      // DECODE PAYLOAD
      // -------------------------------------------------

      const payload =
        parts[1];


      const decodedPayload =
        JSON.parse(
          atob(
            payload
              .replace(/-/g, '+')
              .replace(/_/g, '/')
          )
        );


      console.log(
        'JWT payload:',
        decodedPayload
      );


      // -------------------------------------------------
      // USER ID
      // -------------------------------------------------

      if (
        decodedPayload.userId !== undefined &&
        decodedPayload.userId !== null
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
        'Unable to read JWT:',
        error
      );


      return null;
    }
  }

}