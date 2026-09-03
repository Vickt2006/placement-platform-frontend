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
  // LOGOUT
  // ==========================================

  logout(): void {

    localStorage.removeItem('token');

    this.router.navigate([
      '/login'
    ]);

  }

}