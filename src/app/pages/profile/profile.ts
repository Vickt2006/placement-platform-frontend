import {
  Component,
  OnInit
} from '@angular/core';

import {
  RouterLink,
  Router
} from '@angular/router';

import { FormsModule } from '@angular/forms';

import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-profile',
  standalone: true,

  imports: [
    RouterLink,
    FormsModule
  ],

  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {

  // ==================================================
  // PROFILE DATA
  // ==================================================

  profile: any = {

    id: null,

    user: {
      id: null,
      name: '',
      email: ''
    },

    phone: '',
    college: '',
    degree: '',
    branch: '',
    graduationYear: null,
    cgpa: null,
    resumeUrl: ''
  };


  // ==================================================
  // STATUS
  // ==================================================

  loading = true;

  saving = false;

  message = '';

  errorMessage = '';


  // ==================================================
  // CONSTRUCTOR
  // ==================================================

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}


  // ==================================================
  // INITIALIZE
  // ==================================================

  ngOnInit(): void {

    console.log(
      'PROFILE PAGE OPENED'
    );

    this.loadProfile();
  }


  // ==================================================
  // GET STUDENT ID FROM JWT
  // ==================================================

  getStudentIdFromToken(): number | null {

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


      let payload =
        parts[1];


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


      const userId =
        decodedPayload.userId ??
        decodedPayload.id ??
        decodedPayload.sub;


      if (
        userId === undefined ||
        userId === null
      ) {

        return null;
      }


      const id =
        Number(userId);


      if (Number.isNaN(id)) {

        return null;
      }


      return id;

    } catch (error) {

      console.error(
        'JWT decode error:',
        error
      );

      return null;
    }
  }


  // ==================================================
  // LOAD PROFILE
  // ==================================================

  loadProfile(): void {

    this.loading = true;

    this.message = '';

    this.errorMessage = '';


    const studentId =
      this.getStudentIdFromToken();


    if (!studentId) {

      this.loading = false;

      this.errorMessage =
        'Please login before loading your profile.';

      return;
    }


    const url =
      `https://placement-platform-backend-production.up.railway.app/api/student-profiles/user/${studentId}`;


    this.http
      .get<any>(url)
      .subscribe({

        next: (data: any) => {

          console.log(
            'PROFILE API RESPONSE:',
            data
          );


          if (data && data.id) {

            this.profile = {

              id: data.id,

              user: {

                id:
                  data.user?.id ??
                  studentId,

                name:
                  data.user?.name ??
                  '',

                email:
                  data.user?.email ??
                  ''

              },

              phone:
                data.phone ??
                '',

              college:
                data.college ??
                '',

              degree:
                data.degree ??
                '',

              branch:
                data.branch ??
                '',

              graduationYear:
                data.graduationYear ??
                null,

              cgpa:
                data.cgpa ??
                null,

              resumeUrl:
                data.resumeUrl ??
                ''
            };

          }

          else {

            this.profile = {

              id: null,

              user: {

                id: studentId,

                name: '',

                email: ''

              },

              phone: '',
              college: '',
              degree: '',
              branch: '',
              graduationYear: null,
              cgpa: null,
              resumeUrl: ''
            };


            this.message =
              'Profile not created yet. Fill in your details.';
          }


          this.loading = false;
        },


        error: (error: any) => {

          console.error(
            'PROFILE API ERROR:',
            error
          );


          this.loading = false;


          if (error.status === 401) {

            this.errorMessage =
              'Your login session has expired. Please login again.';

          }

          else if (error.status === 403) {

            this.errorMessage =
              'You are not authorized to access this profile.';

          }

          else if (error.status === 404) {

            this.errorMessage =
              'Profile API endpoint not found.';

          }

          else {

            this.errorMessage =
              'Unable to load profile.';
          }
        }
      });
  }


  // ==================================================
  // PROFILE COMPLETION
  // ==================================================

  getProfileCompletion(): number {

    const fields = [

      this.profile.phone,

      this.profile.college,

      this.profile.degree,

      this.profile.branch,

      this.profile.graduationYear,

      this.profile.cgpa,

      this.profile.resumeUrl

    ];


    const completed =
      fields.filter(
        field =>
          field !== null &&
          field !== undefined &&
          String(field).trim() !== ''
      ).length;


    return Math.round(
      (completed / fields.length) * 100
    );
  }


  // ==================================================
  // COMPLETION MESSAGE
  // ==================================================

  getCompletionMessage(): string {

    const percentage =
      this.getProfileCompletion();


    if (percentage === 100) {

      return 'Profile complete — you are placement ready!';

    }


    if (percentage >= 70) {

      return 'Almost there! Complete your profile.';

    }


    if (percentage >= 40) {

      return 'Good start! Add more details.';

    }


    return 'Complete your profile to improve your opportunities.';
  }


  // ==================================================
  // SAVE PROFILE
  // ==================================================

  saveProfile(): void {

    const studentId =
      this.getStudentIdFromToken();


    if (!studentId) {

      this.errorMessage =
        'Please login before saving your profile.';

      return;
    }


    this.saving = true;

    this.message = '';

    this.errorMessage = '';


    const profileData = {

      user: {
        id: studentId
      },

      phone:
        this.profile.phone || '',

      college:
        this.profile.college || '',

      degree:
        this.profile.degree || '',

      branch:
        this.profile.branch || '',

      graduationYear:
        this.profile.graduationYear !== null &&
        this.profile.graduationYear !== ''
          ? Number(this.profile.graduationYear)
          : null,

      cgpa:
        this.profile.cgpa !== null &&
        this.profile.cgpa !== ''
          ? Number(this.profile.cgpa)
          : null,

      resumeUrl:
        this.profile.resumeUrl || ''
    };


    console.log(
      'SAVE PROFILE DATA:',
      profileData
    );


    // ==================================================
    // UPDATE
    // ==================================================

    if (this.profile.id) {

      this.http
        .put<any>(
          `https://placement-platform-backend-production.up.railway.app/api/student-profiles/${this.profile.id}`,
          profileData
        )
        .subscribe({

          next: (response: any) => {

            if (response) {

              this.profile = {

                ...this.profile,

                ...response,

                user: {

                  ...this.profile.user,

                  ...(response.user || {})
                }
              };
            }


            this.saving = false;

            this.message =
              'Profile updated successfully!';


            setTimeout(() => {

              this.message = '';

            }, 3500);
          },


          error: (error: any) => {

            console.error(
              'PROFILE UPDATE ERROR:',
              error
            );

            this.saving = false;

            this.errorMessage =
              this.getErrorMessage(error);
          }
        });

      return;
    }


    // ==================================================
    // CREATE
    // ==================================================

    this.http
      .post<any>(
        'https://placement-platform-backend-production.up.railway.app/api/student-profiles',
        profileData
      )
      .subscribe({

        next: (response: any) => {

          if (response) {

            this.profile = {

              ...this.profile,

              ...response,

              user: {

                ...this.profile.user,

                ...(response.user || {})
              }
            };
          }


          this.saving = false;

          this.message =
            'Profile created successfully!';


          setTimeout(() => {

            this.message = '';

          }, 3500);
        },


        error: (error: any) => {

          console.error(
            'PROFILE CREATE ERROR:',
            error
          );

          this.saving = false;

          this.errorMessage =
            this.getErrorMessage(error);
        }
      });
  }


  // ==================================================
  // ERROR MESSAGE
  // ==================================================

  getErrorMessage(error: any): string {

    if (
      typeof error?.error === 'string'
    ) {

      return error.error;
    }


    if (
      error?.error?.message
    ) {

      return error.error.message;
    }


    if (error?.status === 401) {

      return 'Your login session has expired. Please login again.';
    }


    if (error?.status === 403) {

      return 'You are not authorized to perform this action.';
    }


    if (error?.status === 404) {

      return 'Requested API endpoint was not found.';
    }


    return 'Something went wrong. Please try again.';
  }


  // ==================================================
  // LOGOUT
  // ==================================================

  logout(): void {

    localStorage.removeItem('token');

    this.router.navigate([
      '/login'
    ]);
  }

}