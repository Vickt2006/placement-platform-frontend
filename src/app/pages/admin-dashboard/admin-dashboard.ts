import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { Admin } from '../../services/admin';


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})


export class AdminDashboard implements OnInit {

  // ==========================================
  // DASHBOARD STATISTICS
  // ==========================================

  totalUsers: number = 0;

  totalStudents: number = 0;

  totalCompanies: number = 0;

  totalJobs: number = 0;

  totalApplications: number = 0;


  // ==========================================
  // UI STATE
  // ==========================================

  loading: boolean = false;

  message: string = '';


  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor(
    private adminService: Admin,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}


  // ==========================================
  // INITIALIZE
  // ==========================================

  ngOnInit(): void {

    this.loadDashboard();

  }


  // ==========================================
  // LOAD ADMIN DASHBOARD
  // ==========================================

  loadDashboard(): void {

    this.loading = true;

    this.message = '';


    this.adminService
      .getDashboardStatistics()
      .subscribe({

        next: (data: any) => {

          console.log(
            'ADMIN DASHBOARD DATA:',
            data
          );


          this.totalUsers =
            Number(data?.totalUsers || 0);


          this.totalStudents =
            Number(data?.totalStudents || 0);


          this.totalCompanies =
            Number(data?.totalCompanies || 0);


          this.totalJobs =
            Number(data?.totalJobs || 0);


          this.totalApplications =
            Number(data?.totalApplications || 0);


          this.loading = false;

          this.cdr.detectChanges();

        },


        error: (error: any) => {

          console.error(
            'ADMIN DASHBOARD ERROR:',
            error
          );


          this.message =
            'Unable to load admin dashboard data.';


          this.loading = false;

          this.cdr.detectChanges();

        }

      });

  }


  // ==========================================
  // OPEN ADMIN COMPANIES
  // ==========================================

  openCompanies(): void {

    console.log(
      'ADMIN: Opening Companies page'
    );

    console.log(
      'Navigating to: /admin-companies'
    );


    this.router.navigateByUrl(
      '/admin-companies'
    );

  }


  // ==========================================
  // OPEN ADMIN STUDENTS
  // ==========================================

  openStudents(): void {

    console.log(
      'ADMIN: Opening Students page'
    );


    this.router.navigateByUrl(
      '/admin-students'
    );

  }


  // ==========================================
  // OPEN ADMIN JOBS
  // ==========================================

  openJobs(): void {

    console.log(
      'ADMIN: Opening Jobs page'
    );


    this.router.navigateByUrl(
      '/admin-jobs'
    );

  }


  // ==========================================
  // OPEN ADMIN APPLICATIONS
  // ==========================================

  openApplications(): void {

    console.log(
      'ADMIN: Opening Applications page'
    );


    this.router.navigateByUrl(
      '/admin-applications'
    );

  }


  // ==========================================
  // LOGOUT
  // ==========================================

  logout(): void {

    localStorage.removeItem('token');


    this.router.navigate([
      '/login'
    ]);

  }

}