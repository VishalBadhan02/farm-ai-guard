import api from '@/api/axios';
import endpoints from '@/api/endpoints';
import { DiseaseReport, ReportFilters, DashboardStats } from '@/types';

export const reportService = {
  async getReports(filters?: ReportFilters) {
    const response = await api.get<DiseaseReport[]>(endpoints.reports.list, {
      params: filters,
    });
    return response.data;
  },

  async getReport(id: string) {
    const response = await api.get<DiseaseReport>(endpoints.reports.get(id));
    return response.data;
  },

  async createReport(formData: FormData) {
    const response = await api.post<DiseaseReport>(
      endpoints.reports.create,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  async updateReport(id: string, data: Partial<DiseaseReport>) {
    const response = await api.patch<DiseaseReport>(
      endpoints.reports.update(id),
      data
    );
    return response.data;
  },

  async deleteReport(id: string) {
    const response = await api.delete(endpoints.reports.delete(id));
    return response.data;
  },

  async approveReport(id: string) {
    const response = await api.post<DiseaseReport>(
      endpoints.reports.approve(id)
    );
    return response.data;
  },

  async rejectReport(id: string, reason?: string) {
    const response = await api.post<DiseaseReport>(
      endpoints.reports.reject(id),
      { reason }
    );
    return response.data;
  },

  async getStats() {
    const response = await api.get<DashboardStats>(endpoints.reports.stats);
    return response.data;
  },
};
