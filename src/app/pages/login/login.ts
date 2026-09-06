import {
  Component,
  ChangeDetectorRef
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';

import { Auth } from '../../services/auth';


@Component({
  selector: 'app-login',
  standalone: true,

  imports: [
    FormsModule
  ],

  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  email: string = '';
  password: string = '';

  message: string = '';
  loading: boolean = false;


  constructor(
    private auth: Auth,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}


  // ==========================================
  // GO TO REGISTER PAGE
  // ==========================================

  goToRegister(event: Event): void {

    event.preventDefault();

    console.log('Opening Register Page...');

    this.router.navigate(['/register']);

  }


  // ==========================================
  // LOGIN
  // ==========================================

  login(): void {

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!this.email || !this.password) {

      this.message =
        'Please enter email and password.';

      this.cdr.detectChanges();

      return;
    }


    // ==========================================
    // START LOGIN
    // ==========================================

    this.loading = true;
    this.message = '';

    this.cdr.detectChanges();


    // ==========================================
    // CALL LOGIN API
    // ==========================================

    this.auth.login(
      this.email,
      this.password
    ).subscribe({

      // ========================================
      // SUCCESS
      // ========================================

      next: (response: any) => {

        console.log(
          'Login response:',
          response
        );


        // ======================================
        // CHECK TOKEN
        // ======================================

        if (
          !response ||
          !response.token
        ) {

          this.message =
            'Login successful, but token was not received.';

          this.loading = false;

          this.cdr.detectChanges();

          return;
        }


        // ======================================
        // SAVE TOKEN
        // ======================================

        const token = response.token;

        localStorage.setItem(
          'token',
          token
        );

        console.log(
          'JWT Token saved'
        );


        // ======================================
        // READ JWT
        // ======================================

        try {

          const payload = JSON.parse(
            atob(
              token
                .split('.')[1]
                .replace(/-/g, '+')
                .replace(/_/g, '/')
            )
          );


          console.log(
            'JWT Payload:',
            payload
          );


          // ====================================
          // NORMALIZE ROLE
          // ====================================

          const role = String(
            payload?.role || ''
          )
            .replace(/^ROLE_/i, '')
            .toUpperCase();


          console.log(
            'NORMALIZED LOGIN ROLE:',
            role
          );


          // ====================================
          // SUCCESS MESSAGE
          // ====================================

          this.message =
            'Login successful!';

          this.loading = false;

          this.cdr.detectChanges();


          // ====================================
          // ADMIN
          // ====================================

          if (role === 'ADMIN') {

            console.log(
              'Redirecting to ADMIN dashboard'
            );

            window.location.href =
              '/admin-dashboard';

            return;
          }


          // ====================================
          // COMPANY
          // ====================================

          if (role === 'COMPANY') {

            console.log(
              'Redirecting to COMPANY dashboard'
            );

            window.location.href =
              '/company-dashboard';

            return;
          }


          // ====================================
          // STUDENT
          // ====================================

          if (role === 'STUDENT') {

            console.log(
              'Redirecting to STUDENT dashboard'
            );

            window.location.href =
              '/dashboard';

            return;
          }


          // ====================================
          // UNKNOWN ROLE
          // ====================================

          console.error(
            'Unknown user role:',
            payload?.role
          );

          localStorage.removeItem(
            'token'
          );

          this.message =
            'Unable to identify user role.';

          this.loading = false;

          this.cdr.detectChanges();

        }


        // ======================================
        // JWT ERROR
        // ======================================

        catch (error) {

          console.error(
            'JWT decode error:',
            error
          );

          localStorage.removeItem(
            'token'
          );

          this.message =
            'Unable to read user role.';

          this.loading = false;

          this.cdr.detectChanges();

        }

      },


      // ========================================
      // LOGIN ERROR
      // ========================================

      error: (error: any) => {

        console.error(
          'Login error:',
          error
        );

        this.message =
          'Invalid email or password.';

        this.loading = false;

        this.cdr.detectChanges();

      }

    });

  }

}