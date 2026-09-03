import { Routes } from '@angular/router';

export const routes: Routes = [

  // ==========================================
  // LOGIN
  // ==========================================

  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login')
        .then(m => m.Login)
  },


  // ==========================================
  // STUDENT REGISTER
  // ==========================================

  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register')
        .then(m => m.Register)
  },


  // ==========================================
  // ADMIN DASHBOARD
  // ==========================================

  {
    path: 'admin-dashboard',
    loadComponent: () =>
      import('./pages/admin-dashboard/admin-dashboard')
        .then(m => m.AdminDashboard)
  },


  // ==========================================
  // ADMIN STUDENTS
  // ==========================================

  {
    path: 'admin-students',
    loadComponent: () =>
      import('./pages/admin-students/admin-students')
        .then(m => m.AdminStudents)
  },


  // ==========================================
  // ADMIN COMPANIES
  // ==========================================

  {
    path: 'admin-companies',
    loadComponent: () =>
      import('./pages/admin-companies/admin-companies')
        .then(m => m.AdminCompanies)
  },


  // ==========================================
  // ADMIN JOBS
  // ==========================================

  {
    path: 'admin-jobs',
    loadComponent: () =>
      import('./pages/admin-jobs/admin-jobs')
        .then(m => m.AdminJobs)
  },


  // ==========================================
  // ADMIN APPLICATIONS
  // ==========================================

  {
    path: 'admin-applications',
    loadComponent: () =>
      import('./pages/admin-applications/admin-applications')
        .then(m => m.AdminApplications)
  },


  // ==========================================
  // STUDENT DASHBOARD
  // ==========================================

  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard')
        .then(m => m.Dashboard)
  },


  // ==========================================
  // STUDENT JOBS
  // ==========================================

  {
    path: 'jobs',
    loadComponent: () =>
      import('./pages/jobs/jobs')
        .then(m => m.Jobs)
  },


  // ==========================================
  // JOB DETAILS
  // ==========================================

  {
    path: 'jobs/:id',
    loadComponent: () =>
      import('./pages/job-details/job-details')
        .then(m => m.JobDetails)
  },


  // ==========================================
  // STUDENT APPLICATIONS
  // ==========================================

  {
    path: 'applications',
    loadComponent: () =>
      import('./pages/applications/applications')
        .then(m => m.Applications)
  },


  // ==========================================
  // STUDENT PROFILE
  // ==========================================

  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile/profile')
        .then(m => m.Profile)
  },


  // ==========================================
  // COMPANY DASHBOARD
  // ==========================================

  {
    path: 'company-dashboard',
    loadComponent: () =>
      import('./pages/company-dashboard/company-dashboard')
        .then(m => m.CompanyDashboard)
  },


  // ==========================================
  // DEFAULT ROUTE
  // ==========================================

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },


  // ==========================================
  // UNKNOWN ROUTE
  // ==========================================

  {
    path: '**',
    redirectTo: 'login'
  }

];