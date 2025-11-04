import api from '@/api/axios';
import endpoints from '@/api/endpoints';
import { DiagnosisResult } from '@/types';

export const diseaseService = {
  async analyzeCropImage(formData: FormData) {
    const response = await api.post<DiagnosisResult>(
      endpoints.diagnosis.analyze,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  async getDiagnosisHistory() {
    const response = await api.get<DiagnosisResult[]>(
      endpoints.diagnosis.history
    );
    return response.data;
  },
};
