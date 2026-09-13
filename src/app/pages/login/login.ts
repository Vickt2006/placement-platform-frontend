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
  loginSuccess: boolean = false;

  constructor(
    private auth: Auth,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  goToRegister(event: Event): void {
    event.preventDefault();

    console.log('Opening Register Page...');

    this.router.navigate(['/register']);
  }

  login(): void {

    if (!this.email || !this.password) {
      this.message = 'Please enter email and password.';
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.message = '';
    this.loginSuccess = false;

    this.cdr.detectChanges();

    console.log('Starting login...');

    this.auth.login(this.email, this.password).subscribe({

      next: (response: any) => {

        console.log('Login response:', response);

        if (!response || !response.token) {

          this.message =
            'Login successful, but token was not received.';

          this.loading = false;

          this.cdr.detectChanges();

          return;
        }

        const token = response.token;

        localStorage.setItem('token', token);

        console.log('JWT Token saved');

        try {

          const payload = JSON.parse(
            atob(
              token
                .split('.')[1]
                .replace(/-/g, '+')
                .replace(/_/g, '/')
            )
          );

          console.log('JWT Payload:', payload);

          const role = String(
            payload?.role || ''
          )
            .replace(/^ROLE_/i, '')
            .toUpperCase();

          console.log(
            'NORMALIZED LOGIN ROLE:',
            role
          );

          if (
            role !== 'ADMIN' &&
            role !== 'COMPANY' &&
            role !== 'STUDENT'
          ) {

            console.error(
              'Unknown user role:',
              payload?.role
            );

            localStorage.removeItem('token');

            this.message =
              'Unable to identify user role.';

            this.loading = false;
            this.loginSuccess = false;

            this.cdr.detectChanges();

            return;
          }

          this.message = 'Login successful!';

          this.loading = false;
          this.loginSuccess = true;

          this.cdr.detectChanges();

          console.log(
            'LOGIN MISSION AUTHORIZED'
          );

          setTimeout(() => {

            if (role === 'ADMIN') {

              console.log(
                'Redirecting to ADMIN dashboard'
              );

              window.location.href =
                '/admin-dashboard';

              return;
            }

            if (role === 'COMPANY') {

              console.log(
                'Redirecting to COMPANY dashboard'
              );

              window.location.href =
                '/company-dashboard';

              return;
            }

            if (role === 'STUDENT') {

              console.log(
                'Redirecting to STUDENT dashboard'
              );

              window.location.href =
                '/dashboard';

              return;
            }

          }, 2200);

        } catch (error) {

          console.error(
            'JWT decode error:',
            error
          );

          localStorage.removeItem('token');

          this.message =
            'Unable to read user role.';

          this.loading = false;
          this.loginSuccess = false;

          this.cdr.detectChanges();
        }
      },

      error: (error: any) => {

        console.error(
          'Login error:',
          error
        );

        this.message =
          'Invalid email or password.';

        this.loading = false;
        this.loginSuccess = false;

        this.cdr.detectChanges();
      }

    });
  }
}