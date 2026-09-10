import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

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
    RouterLink,
    FormsModule
  ],

  templateUrl: './admin-companies.html',

  styleUrl: './admin-companies.css'
})


export class AdminCompanies implements OnInit {

  // ==========================================
  // COMPANIES
  // ==========================================

  companies: any[] = [];

  filteredCompanies: any[] = [];


  // ==========================================
  // SEARCH
  // ==========================================

  searchTerm = '';


  // ==========================================
  // LOADING
  // ==========================================

  loading = false;


  // ==========================================
  // DELETE LOADING
  // ==========================================

  deletingCompanyId: number | null = null;


  // ==========================================
  // SELECTED COMPANY
  // ==========================================

  selectedCompany: any = null;


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


    this.cdr.detectChanges();


    this.adminService

      .getAllCompanies()

      .pipe(

        finalize(() => {

          console.log(
            'Companies request finished.'
          );


          this.loading = false;


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


          if (Array.isArray(data)) {

            this.companies = data;

          }

          else {

            this.companies = [];

          }


          // ==================================
          // APPLY SEARCH
          // ==================================

          this.filterCompanies();


          console.log(
            'TOTAL COMPANIES:',
            this.companies.length
          );


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

          this.filteredCompanies = [];


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
  // SEARCH COMPANIES
  // ==========================================

  filterCompanies(): void {

    const search =
      this.searchTerm
        .trim()
        .toLowerCase();


    // ========================================
    // NO SEARCH
    // ========================================

    if (!search) {

      this.filteredCompanies = [
        ...this.companies
      ];

      return;

    }


    // ========================================
    // SEARCH
    // ========================================

    this.filteredCompanies =
      this.companies.filter(
        (company: any) => {

          const name =
            company?.name
              ? String(company.name).toLowerCase()
              : '';

          const email =
            company?.email
              ? String(company.email).toLowerCase()
              : '';

          const location =
            company?.location
              ? String(company.location).toLowerCase()
              : '';

          const website =
            company?.website
              ? String(company.website).toLowerCase()
              : '';


          return (

            name.includes(search) ||

            email.includes(search) ||

            location.includes(search) ||

            website.includes(search)

          );

        }
      );

  }


  // ==========================================
  // SEARCH INPUT
  // ==========================================

  onSearch(): void {

    this.filterCompanies();

  }


  // ==========================================
  // CLEAR SEARCH
  // ==========================================

  clearSearch(): void {

    this.searchTerm = '';

    this.filterCompanies();

  }


  // ==========================================
  // REFRESH
  // ==========================================

  refreshCompanies(): void {

    console.log(
      'Refresh companies clicked.'
    );


    this.searchTerm = '';

    this.loadCompanies();

  }


  // ==========================================
  // OPEN COMPANY DETAILS
  // ==========================================

  openCompany(company: any): void {

    if (!company) {

      return;

    }


    console.log(
      'Opening company details:',
      company
    );


    this.selectedCompany = company;


    this.cdr.detectChanges();

  }


  // ==========================================
  // CLOSE COMPANY DETAILS
  // ==========================================

  closeCompany(): void {

    this.selectedCompany = null;

    this.cdr.detectChanges();

  }


  // ==========================================
  // DELETE COMPANY
  // ==========================================

  deleteCompany(company: any): void {

    if (!company || !company.id) {

      console.error(
        'Invalid company selected for deletion.'
      );

      return;

    }


    const companyName =
      company?.name || 'this company';


    // ========================================
    // CONFIRMATION
    // ========================================

    const confirmed =
      window.confirm(
        `Are you sure you want to delete ${companyName}?`
      );


    if (!confirmed) {

      return;

    }


    console.log(
      'Deleting company:',
      company
    );


    // ========================================
    // START DELETE
    // ========================================

    this.deletingCompanyId =
      Number(company.id);

    this.message = '';

    this.cdr.detectChanges();


    // ========================================
    // DELETE API
    // ========================================

    this.adminService

      .deleteCompany(
        Number(company.id)
      )

      .pipe(

        finalize(() => {

          this.deletingCompanyId =
            null;

          this.cdr.detectChanges();

        })

      )

      .subscribe({

        // ====================================
        // SUCCESS
        // ====================================

        next: (response: any) => {

          console.log(
            'COMPANY DELETE RESPONSE:',
            response
          );


          // ==================================
          // REMOVE FROM LOCAL LIST
          // ==================================

          this.companies =
            this.companies.filter(
              (item: any) =>
                Number(item.id) !==
                Number(company.id)
            );


          // ==================================
          // UPDATE SEARCHED LIST
          // ==================================

          this.filterCompanies();


          // Close modal if deleted company
          // was currently selected

          if (
            this.selectedCompany &&
            Number(this.selectedCompany.id) ===
            Number(company.id)
          ) {

            this.selectedCompany = null;

          }


          this.message =
            'Company deleted successfully.';


          console.log(
            'Company deleted successfully.'
          );


          this.cdr.detectChanges();

        },


        // ====================================
        // ERROR
        // ====================================

        error: (error: any) => {

          console.error(
            'DELETE COMPANY ERROR:',
            error
          );


          if (error?.status === 401) {

            this.message =
              'Unauthorized. Please login again.';

          }

          else if (error?.status === 403) {

            this.message =
              'You do not have permission to delete this company.';

          }

          else if (error?.status === 404) {

            this.message =
              'Company not found.';

          }

          else {

            this.message =
              'Unable to delete company.';

          }


          this.cdr.detectChanges();

        }

      });

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