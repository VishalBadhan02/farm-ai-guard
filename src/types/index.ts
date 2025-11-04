export interface User {
  id: string;
  email: string;
  name: string;
  role: 'farmer' | 'admin' | 'expert';
  phone?: string;
  location?: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  location?: string;
}

export interface DiseaseReport {
  id: string;
  userId: string;
  userName: string;
  cropType: string;
  diseaseName: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  images: string[];
  treatment?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface DiagnosisResult {
  diseaseName: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  treatment: string;
  preventiveMeasures: string[];
  affectedCrops: string[];
}

export interface MapMarker {
  id: string;
  position: [number, number];
  report: DiseaseReport;
}

export interface DashboardStats {
  totalReports: number;
  pendingReports: number;
  criticalReports: number;
  recentDiagnoses: number;
}

export interface ReportFilters {
  status?: DiseaseReport['status'];
  severity?: DiseaseReport['severity'];
  cropType?: string;
  dateFrom?: string;
  dateTo?: string;
  searchQuery?: string;
}
