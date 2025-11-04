import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportService } from '@/services/reportService';
import { ReportFilters } from '@/types';
import { toast } from '@/hooks/use-toast';

export const useReports = (filters?: ReportFilters) => {
  return useQuery({
    queryKey: ['reports', filters],
    queryFn: () => reportService.getReports(filters),
  });
};

export const useReport = (id: string) => {
  return useQuery({
    queryKey: ['report', id],
    queryFn: () => reportService.getReport(id),
    enabled: !!id,
  });
};

export const useCreateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => reportService.createReport(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast({
        title: 'Success',
        description: 'Report created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create report',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      reportService.updateReport(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['report', id] });

      // Snapshot previous value
      const previousReport = queryClient.getQueryData(['report', id]);

      // Optimistically update
      queryClient.setQueryData(['report', id], (old: any) => ({
        ...old,
        ...data,
      }));

      return { previousReport };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousReport) {
        queryClient.setQueryData(
          ['report', variables.id],
          context.previousReport
        );
      }
      toast({
        title: 'Error',
        description: 'Failed to update report',
        variant: 'destructive',
      });
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['report', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
};

export const useDeleteReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => reportService.deleteReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast({
        title: 'Success',
        description: 'Report deleted successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete report',
        variant: 'destructive',
      });
    },
  });
};

export const useApproveReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => reportService.approveReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast({
        title: 'Success',
        description: 'Report approved',
      });
    },
  });
};

export const useReportStats = () => {
  return useQuery({
    queryKey: ['report-stats'],
    queryFn: () => reportService.getStats(),
  });
};
