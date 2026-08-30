import {
  Component,
  ChangeDetectorRef
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
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

  login(): void {

    if (!this.email || !this.password) {

      this.message =
        'Please enter email and password.';

      this.cdr.detectChanges();

      return;
    }

    this.loading = true;
    this.message = '';

    this.cdr.detectChanges();

    this.auth.login(
      this.email,
      this.password
    ).subscribe({

      next: (response: any) => {

        console.log(
          'Login response:',
          response
        );

        if (response && response.token) {

          // Save JWT token
          localStorage.setItem(
            'token',
            response.token
          );

          console.log(
            'JWT Token:',
            response.token
          );

          this.message =
            'Login successful!';

          this.loading = false;

          this.cdr.detectChanges();

          // Navigate to Dashboard
          this.router.navigate([
            '/dashboard'
          ]);

        } else {

          this.message =
            'Login successful, but token was not received.';

          this.loading = false;

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

        this.cdr.detectChanges();
      }

    });
  }
}