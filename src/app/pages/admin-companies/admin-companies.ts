import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  Router,
  RouterLink
} from '@angular/router';

import { finalize } from 'rxjs/operators';

import { Admin } from '../../services/admin';


@Component({
  selector: 'app-admin-companies',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './admin-companies.html',

  styleUrl: './admin-companies.css'
})


export class AdminCompanies implements OnInit {


  // ==========================================
  // COMPANIES
  // ==========================================

  companies: any[] = [];


  // ==========================================
  // LOADING
  // ==========================================

  loading = false;


  // ==========================================
  // MESSAGE
  // ==========================================

  message = '';


  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor(

    private adminService: Admin,

    private router: Router,

    private cdr: ChangeDetectorRef

  ) {}


  // ==========================================
  // INIT
  // ==========================================

  ngOnInit(): void {

    console.log(
      '=========================================='
    );

    console.log(
      'ADMIN COMPANIES COMPONENT STARTED'
    );

    console.log(
      '=========================================='
    );


    this.loadCompanies();

  }


  // ==========================================
  // LOAD COMPANIES
  // ==========================================

  loadCompanies(): void {

    console.log(
      'Loading companies from backend...'
    );


    this.loading = true;

    this.message = '';


    // ========================================
    // FORCE UI UPDATE
    // ========================================

    this.cdr.detectChanges();


    this.adminService

      .getAllCompanies()

      .pipe(

        // ====================================
        // ALWAYS STOP LOADING
        // ====================================

        finalize(() => {

          console.log(
            'Companies request finished.'
          );


          this.loading = false;


          // ==================================
          // FORCE UI UPDATE
          // ==================================

          this.cdr.detectChanges();

        })

      )

      .subscribe({


        // ====================================
        // SUCCESS
        // ====================================

        next: (data: any[]) => {

          console.log(
            'COMPANIES API RESPONSE:',
            data
          );


          // ==================================
          // STORE COMPANY DATA
          // ==================================

          if (Array.isArray(data)) {

            this.companies = data;

          }

          else {

            this.companies = [];

          }


          console.log(
            'TOTAL COMPANIES:',
            this.companies.length
          );


          // ==================================
          // FORCE UI UPDATE
          // ==================================

          this.cdr.detectChanges();

        },


        // ====================================
        // ERROR
        // ====================================

        error: (error: any) => {

          console.error(
            'COMPANIES API ERROR:',
            error
          );


          this.companies = [];


          // ==================================
          // ERROR MESSAGE
          // ==================================

          if (error?.status === 401) {

            this.message =
              'Unauthorized. Please login again.';

          }


          else if (error?.status === 403) {

            this.message =
              'You do not have permission to view companies.';

          }


          else {

            this.message =
              'Unable to load companies.';

          }


          // ==================================
          // FORCE UI UPDATE
          // ==================================

          this.cdr.detectChanges();

        },


        // ====================================
        // COMPLETE
        // ====================================

        complete: () => {

          console.log(
            'Companies API request completed.'
          );

        }

      });

  }


  // ==========================================
  // REFRESH
  // ==========================================

  refreshCompanies(): void {

    console.log(
      'Refresh companies clicked.'
    );


    this.loadCompanies();

  }


  // ==========================================
  // LOGOUT
  // ==========================================

  logout(): void {

    localStorage.removeItem(
      'token'
    );


    this.router.navigate([
      '/login'
    ]);

  }

}