import {
  Component,
  OnInit,
  ChangeDetectorRef
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

  private apiUrl =
    'https://placement-platform-backend-production.up.railway.app/api/student-profiles';

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

  loading: boolean = true;
  saving: boolean = false;

  message: string = '';
  errorMessage: string = '';


  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}


  // ==========================================
  // INIT
  // ==========================================

  ngOnInit(): void {

    console.log('PROFILE PAGE OPENED');

    this.loadProfile();
  }


  // ==========================================
  // GET STUDENT ID FROM JWT
  // ==========================================

  getStudentIdFromToken(): number | null {

    const token = localStorage.getItem('token');

    if (!token) {

      console.error('JWT token not found.');

      return null;
    }

    try {

      const parts = token.split('.');

      if (parts.length !== 3) {

        console.error('Invalid JWT token.');

        return null;
      }

      let payload = parts[1];

      payload = payload
        .replace(/-/g, '+')
        .replace(/_/g, '/');

      while (payload.length % 4 !== 0) {

        payload += '=';
      }

      const decodedPayload =
        JSON.parse(atob(payload));

      console.log(
        'JWT PAYLOAD:',
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
          'User ID not found in JWT.'
        );

        return null;
      }

      const id = Number(userId);

      if (Number.isNaN(id)) {

        console.error(
          'Invalid user ID.'
        );

        return null;
      }

      return id;

    } catch (error) {

      console.error(
        'JWT DECODE ERROR:',
        error
      );

      return null;
    }
  }


  // ==========================================
  // LOAD PROFILE
  // ==========================================

  loadProfile(): void {

    console.log(
      'STARTING PROFILE LOAD...'
    );

    this.loading = true;
    this.message = '';
    this.errorMessage = '';

    const studentId =
      this.getStudentIdFromToken();


    if (!studentId) {

      this.loading = false;

      this.errorMessage =
        'Please login before loading your profile.';

      this.cdr.detectChanges();

      return;
    }


    const url =
      `${this.apiUrl}/user/${studentId}`;


    console.log(
      'PROFILE API URL:',
      url
    );


    this.http.get<any>(url).subscribe({

      // ======================================
      // SUCCESS
      // ======================================

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
              data.phone ?? '',

            college:
              data.college ?? '',

            degree:
              data.degree ?? '',

            branch:
              data.branch ?? '',

            graduationYear:
              data.graduationYear ?? null,

            cgpa:
              data.cgpa ?? null,

            resumeUrl:
              data.resumeUrl ?? ''
          };


          console.log(
            'PROFILE OBJECT SET:',
            this.profile
          );

        } else {

          console.log(
            'PROFILE DATA EMPTY'
          );


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

        this.cdr.detectChanges();

        console.log(
          'PROFILE LOADING COMPLETE'
        );
      },


      // ======================================
      // ERROR
      // ======================================

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


        this.cdr.detectChanges();
      }
    });
  }


  // ==========================================
  // PROFILE COMPLETION
  // ==========================================

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


  // ==========================================
  // COMPLETION MESSAGE
  // ==========================================

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


  // ==========================================
  // SAVE PROFILE
  // ==========================================

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
      'SAVING PROFILE:',
      profileData
    );


    // ======================================
    // UPDATE EXISTING PROFILE
    // ======================================

    if (this.profile.id) {

      this.http.put<any>(

        `${this.apiUrl}/${this.profile.id}`,

        profileData

      ).subscribe({

        next: (response: any) => {

          console.log(
            'PROFILE UPDATED:',
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


          this.cdr.detectChanges();


          setTimeout(() => {

            this.message = '';

            this.cdr.detectChanges();

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


          this.cdr.detectChanges();
        }
      });


      return;
    }


    // ======================================
    // CREATE PROFILE
    // ======================================

    this.http.post<any>(

      this.apiUrl,

      profileData

    ).subscribe({

      next: (response: any) => {

        console.log(
          'PROFILE CREATED:',
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


        this.cdr.detectChanges();


        setTimeout(() => {

          this.message = '';

          this.cdr.detectChanges();

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


        this.cdr.detectChanges();
      }
    });
  }


  // ==========================================
  // ERROR MESSAGE
  // ==========================================

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


  // ==========================================
  // LOGOUT
  // ==========================================

  logout(): void {

    localStorage.removeItem('token');

    this.router.navigate(['/login']);
  }
}