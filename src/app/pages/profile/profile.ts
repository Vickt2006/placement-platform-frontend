import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
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

  loading = false;
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

    console.log('PROFILE PAGE OPENED');

    this.loadProfile();
  }


  // ==================================================
  // GET STUDENT ID FROM JWT
  // ==================================================

  getStudentIdFromToken(): number | null {

    const token = localStorage.getItem('token');

    console.log('Token exists:', !!token);

    if (!token) {
      return null;
    }

    try {

      const parts = token.split('.');

      if (parts.length !== 3) {

        console.error('Invalid JWT token');

        return null;
      }

      let payload = parts[1];

      payload = payload
        .replace(/-/g, '+')
        .replace(/_/g, '/');

      while (payload.length % 4 !== 0) {
        payload += '=';
      }

      const decodedPayload = JSON.parse(
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

        console.error(
          'User ID not found in JWT'
        );

        return null;
      }

      const id = Number(userId);

      if (Number.isNaN(id)) {

        console.error(
          'Invalid User ID:',
          userId
        );

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

    console.log(
      'LOAD PROFILE STARTED'
    );

    const studentId =
      this.getStudentIdFromToken();

    console.log(
      'Student ID:',
      studentId
    );

    if (!studentId) {

      this.loading = false;

      this.errorMessage =
        'Please login before loading your profile.';

      return;
    }

    this.message = '';
    this.errorMessage = '';

    const url =
      `https://placement-platform-backend-production.up.railway.app/api/student-profiles/user/${studentId}`;

    console.log(
      'Calling Profile API:',
      url
    );

    this.http
      .get<any>(url)
      .subscribe({

        // ==========================================
        // SUCCESS
        // ==========================================

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

            console.log(
              'PROFILE LOADED:',
              this.profile
            );

          } else {

            // ======================================
            // PROFILE NOT FOUND
            // ======================================

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
              'Profile not created yet. Please fill in your details.';
          }

          this.loading = false;

          console.log(
            'LOADING:',
            this.loading
          );
        },


        // ==========================================
        // ERROR
        // ==========================================

        error: (error: any) => {

          console.error(
            'PROFILE API ERROR:',
            error
          );

          this.loading = false;

          if (error.status === 401) {

            this.errorMessage =
              'Your login session has expired. Please login again.';

          } else if (error.status === 403) {

            this.errorMessage =
              'You are not authorized to access this profile.';

          } else if (error.status === 404) {

            this.errorMessage =
              'Profile API endpoint not found.';

          } else {

            this.errorMessage =
              'Unable to load profile.';

          }
        }

      });
  }


  // ==================================================
  // SAVE PROFILE
  // ==================================================

  saveProfile(): void {

    const studentId =
      this.getStudentIdFromToken();

    console.log(
      'SAVE PROFILE - Student ID:',
      studentId
    );

    if (!studentId) {

      this.errorMessage =
        'Please login before saving your profile.';

      return;
    }

    this.saving = true;

    this.message = '';
    this.errorMessage = '';


    // ==============================================
    // DATA TO SEND
    // ==============================================

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
          ? Number(
              this.profile.graduationYear
            )
          : null,

      cgpa:
        this.profile.cgpa !== null &&
        this.profile.cgpa !== ''
          ? Number(
              this.profile.cgpa
            )
          : null,

      resumeUrl:
        this.profile.resumeUrl || ''

    };


    console.log(
      'SAVE PROFILE DATA:',
      profileData
    );


    // ==============================================
    // UPDATE EXISTING PROFILE
    // ==============================================

    if (this.profile.id) {

      console.log(
        'UPDATING PROFILE ID:',
        this.profile.id
      );

      this.http
        .put<any>(
          `https://placement-platform-backend-production.up.railway.app/api/student-profiles/${this.profile.id}`,
          profileData
        )
        .subscribe({

          next: (response: any) => {

            console.log(
              'PROFILE UPDATE SUCCESS:',
              response
            );

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

    }


    // ==============================================
    // CREATE NEW PROFILE
    // ==============================================

    else {

      console.log(
        'CREATING NEW PROFILE'
      );

      this.http
        .post<any>(
          'https://placement-platform-backend-production.up.railway.app/api/student-profiles',
          profileData
        )
        .subscribe({

          next: (response: any) => {

            console.log(
              'PROFILE CREATE SUCCESS:',
              response
            );

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