import api from '@/api/axios';
import endpoints from '@/api/endpoints';
import { DiagnosisResult } from '@/types';

export const diseaseService = {
  async analyzeCropImage(formData: any) {
    const response = await api.post<DiagnosisResult>(
      endpoints.diagnose.analyze,
      formData,
      // {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // }
      // body: JSON.stringify(formData)
    );
    return response.data;
  },

  async getDiagnosisHistory() {
    const response = await api.get<DiagnosisResult[]>(
      endpoints.diagnose.history
    );
    return response.data;
  },
};
