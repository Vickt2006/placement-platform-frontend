import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { Admin } from '../../services/admin';


@Component({
  selector: 'app-admin-students',
  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './admin-students.html',
  styleUrl: './admin-students.css'
})
export class AdminStudents implements OnInit {

  // ==========================================
  // STUDENTS
  // ==========================================

  students: any[] = [];


  // ==========================================
  // LOADING
  // ==========================================

  loading: boolean = false;


  // ==========================================
  // MESSAGE
  // ==========================================

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

    console.log(
      'ADMIN STUDENTS PAGE OPENED'
    );

    this.loadStudents();

  }


  // ==========================================
  // LOAD STUDENTS
  // ==========================================

  loadStudents(): void {

    this.loading = true;

    this.message = '';

    this.cdr.detectChanges();


    console.log(
      'Loading students...'
    );


    this.adminService
      .getAllStudents()
      .subscribe({

        // ======================================
        // SUCCESS
        // ======================================

        next: (data: any[]) => {

          console.log(
            'Students API Response:',
            data
          );


          if (Array.isArray(data)) {

            this.students = data;

          } else {

            this.students = [];

          }


          console.log(
            'Total Students:',
            this.students.length
          );


          this.loading = false;


          // Force Angular UI update
          this.cdr.detectChanges();

        },


        // ======================================
        // ERROR
        // ======================================

        error: (error: any) => {

          console.error(
            'Error loading students:',
            error
          );


          this.students = [];

          this.loading = false;


          if (error.status === 401) {

            this.message =
              'Your login session has expired. Please login again.';

          }

          else if (error.status === 403) {

            this.message =
              'You are not authorized to view students.';

          }

          else if (error.status === 404) {

            this.message =
              'Students API endpoint not found.';

          }

          else {

            this.message =
              'Unable to load students.';

          }


          // Force Angular UI update
          this.cdr.detectChanges();

        },


        // ======================================
        // COMPLETE
        // ======================================

        complete: () => {

          console.log(
            'Student request completed.'
          );

        }

      });

  }


  // ==========================================
  // REFRESH STUDENTS
  // ==========================================

  refreshStudents(): void {

    console.log(
      'Refreshing students...'
    );

    this.loadStudents();

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