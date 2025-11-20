// API endpoint definitions
// Replace these with your actual backend endpoints

export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    verifyEmail: '/auth/verify-email',
    verifyOTP: '/auth/verify-otp',
    resendOTP: '/auth/resend-otp',
    profile: '/auth/profile',
  },
  reports: {
    list: '/diagnose/reports',
    create: '/diagnose/reports',
    get: (id: string) => `/reports/${id}`,
    update: (id: string) => `/reports/${id}`,
    delete: (id: string) => `/reports/${id}`,
    approve: (id: string) => `/reports/${id}/approve`,
    reject: (id: string) => `/reports/${id}/reject`,
    stats: '/reports/stats',
  },
  diagnose: {
    analyze: '/diagnose/analyze',
    history: '/diagnose/history',
  },
  admin: {
    users: '/admin/users',
    user: (id: string) => `/admin/users/${id}`,
    reports: '/admin/reports',
    stats: '/admin/stats',
  },
  media:{
    url:"/media/generate-upload-url"
  }
} as const;

export default endpoints;
