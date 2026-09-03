import {
  Component,
  ChangeDetectorRef,
  OnInit
} from '@angular/core';

import {
  RouterLink,
  Router
} from '@angular/router';

import { FormsModule } from '@angular/forms';

import { Job } from '../../services/job';


@Component({
  selector: 'app-jobs',

  standalone: true,

  imports: [
    RouterLink,
    FormsModule
  ],

  templateUrl: './jobs.html',

  styleUrl: './jobs.css'
})
export class Jobs implements OnInit {


  // ==========================================
  // VARIABLES
  // ==========================================

  jobs: any[] = [];

  filteredJobs: any[] = [];

  loading: boolean = true;

  message: string = '';

  searchText: string = '';


  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor(
    private jobService: Job,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}


  // ==========================================
  // INITIALIZE
  // ==========================================

  ngOnInit(): void {

    this.loadJobs();

  }


  // ==========================================
  // LOAD JOBS
  // ==========================================

  loadJobs(): void {

    this.loading = true;

    this.message = '';

    this.jobService
      .getJobs()
      .subscribe({

        next: (response: any[]) => {

          console.log(
            'Jobs loaded:',
            response
          );

          this.jobs = Array.isArray(response)
            ? response
            : [];

          this.filteredJobs = [
            ...this.jobs
          ];

          this.loading = false;

          this.cdr.detectChanges();

        },


        error: (error: any) => {

          console.error(
            'Jobs loading error:',
            error
          );

          this.jobs = [];

          this.filteredJobs = [];

          this.message =
            'Unable to load jobs.';

          this.loading = false;

          this.cdr.detectChanges();

        }

      });

  }


  // ==========================================
  // SEARCH JOBS
  // ==========================================

  searchJobs(): void {

    const search =
      this.searchText
        .trim()
        .toLowerCase();


    if (!search) {

      this.filteredJobs = [
        ...this.jobs
      ];

      return;

    }


    this.filteredJobs =
      this.jobs.filter(
        (job: any) => {

          const title =
            job.title
              ?.toLowerCase() || '';

          const skills =
            job.skills
              ?.toLowerCase() || '';

          const location =
            job.location
              ?.toLowerCase() || '';

          const jobType =
            job.jobType
              ?.toLowerCase() || '';


          return (
            title.includes(search) ||
            skills.includes(search) ||
            location.includes(search) ||
            jobType.includes(search)
          );

        }
      );

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