import { Routes } from '@angular/router';

export const routes: Routes = [

  // =========================
  // LOGIN
  // =========================

  {
    path: 'login',

    loadComponent: () =>
      import('./pages/login/login')
        .then(m => m.Login)
  },


  // =========================
  // DASHBOARD
  // =========================

  {
    path: 'dashboard',

    loadComponent: () =>
      import('./pages/dashboard/dashboard')
        .then(m => m.Dashboard)
  },


  // =========================
  // JOB DETAILS
  // =========================

  {
    path: 'jobs/:id',

    loadComponent: () =>
      import('./pages/job-details/job-details')
        .then(m => m.JobDetails)
  },


  // =========================
  // MY APPLICATIONS
  // =========================

  {
    path: 'applications',

    loadComponent: () =>
      import('./pages/applications/applications')
        .then(m => m.Applications)
  },


  // =========================
  // DEFAULT
  // =========================

  {
    path: '',

    redirectTo: 'login',

    pathMatch: 'full'
  },


  // =========================
  // UNKNOWN URL
  // =========================

  {
    path: '**',

    redirectTo: 'login'
  }

];