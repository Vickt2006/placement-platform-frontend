import {
  Component,
  ChangeDetectorRef
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import {
  Router,
  RouterLink
} from '@angular/router';

import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-register',

  standalone: true,

  imports: [
    FormsModule,
    RouterLink
  ],

  templateUrl: './register.html',

  styleUrl: './register.css'
})
export class Register {

  name: string = '';

  email: string = '';

  password: string = '';

  confirmPassword: string = '';

  message: string = '';

  loading: boolean = false;

  registrationSuccess: boolean = false;


  constructor(
    private http: HttpClient,

    private router: Router,

    private cdr: ChangeDetectorRef
  ) {}


  // =====================================================
  // REGISTER
  // =====================================================

  register(): void {

    this.message = '';


    // ===================================================
    // VALIDATION
    // ===================================================

    if (
      !this.name ||
      !this.email ||
      !this.password ||
      !this.confirmPassword
    ) {

      this.message =
        'Please fill all fields.';

      this.cdr.detectChanges();

      return;
    }


    // ===================================================
    // PASSWORD MATCH
    // ===================================================

    if (
      this.password !== this.confirmPassword
    ) {

      this.message =
        'Passwords do not match.';

      this.cdr.detectChanges();

      return;
    }


    // ===================================================
    // PASSWORD LENGTH
    // ===================================================

    if (
      this.password.length < 6
    ) {

      this.message =
        'Password must be at least 6 characters.';

      this.cdr.detectChanges();

      return;
    }


    // ===================================================
    // START
    // ===================================================

    this.loading = true;

    this.message = '';

    this.cdr.detectChanges();


    // ===================================================
    // USER
    // ===================================================

    const user = {

      name:
        this.name.trim(),

      email:
        this.email.trim(),

      password:
        this.password,

      role:
        'STUDENT'

    };


    console.log(
      'Registering student:',
      user
    );


    // ===================================================
    // API
    // ===================================================

    this.http
      .post<any>(
        'https://placement-platform-backend-production.up.railway.app/api/users/register',
        user
      )
      .subscribe({

        // ===============================================
        // SUCCESS
        // ===============================================

        next: (response: any) => {

          console.log(
            'Registration response:',
            response
          );


          this.loading = false;

          this.message =
            'Account created successfully!';

          this.registrationSuccess = true;

          this.cdr.detectChanges();


          console.log(
            'REGISTRATION SUCCESS ANIMATION STARTED'
          );


          // =============================================
          // REDIRECT
          // =============================================

          setTimeout(() => {

            this.registrationSuccess = false;

            this.cdr.detectChanges();

            this.router.navigate([
              '/login'
            ]);

          }, 5000);

        },


        // ===============================================
        // ERROR
        // ===============================================

        error: (error: any) => {

          console.error(
            'Registration error:',
            error
          );


          this.loading = false;


          if (
            error.status === 409
          ) {

            this.message =
              'Email already exists. Please use another email.';

          }

          else if (
            error.status === 400
          ) {

            this.message =
              'Invalid registration details.';

          }

          else if (
            error.status === 0
          ) {

            this.message =
              'Unable to connect to server.';

          }

          else {

            this.message =
              'Registration failed. Please try again.';

          }


          this.cdr.detectChanges();

        }

      });

  }

}