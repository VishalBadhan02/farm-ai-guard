import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { io, Socket } from 'socket.io-client';
import { DiseaseReport } from '@/types';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3000';

export const useRealtime = () => {
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Connect to WebSocket server
    socketRef.current = io(WS_URL, {
      auth: {
        token: localStorage.getItem('accessToken'),
      },
    });

    const socket = socketRef.current;

    // Listen for report created events
    socket.on('report:created', (report: DiseaseReport) => {
      console.log('New report created:', report);
      
      // Update reports list
      queryClient.setQueryData<DiseaseReport[]>(['reports'], (old) => {
        if (!old) return [report];
        return [report, ...old];
      });

      // Invalidate stats
      queryClient.invalidateQueries({ queryKey: ['report-stats'] });
    });

    // Listen for report updated events
    socket.on('report:updated', (report: DiseaseReport) => {
      console.log('Report updated:', report);
      
      // Update specific report
      queryClient.setQueryData(['report', report.id], report);
      
      // Update reports list
      queryClient.setQueryData<DiseaseReport[]>(['reports'], (old) => {
        if (!old) return [report];
        return old.map((r) => (r.id === report.id ? report : r));
      });

      // Invalidate stats
      queryClient.invalidateQueries({ queryKey: ['report-stats'] });
    });

    // Listen for report deleted events
    socket.on('report:deleted', (reportId: string) => {
      console.log('Report deleted:', reportId);
      
      // Update reports list
      queryClient.setQueryData<DiseaseReport[]>(['reports'], (old) => {
        if (!old) return [];
        return old.filter((r) => r.id !== reportId);
      });

      // Invalidate stats
      queryClient.invalidateQueries({ queryKey: ['report-stats'] });
    });

    // Connection events
    socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    // Cleanup on unmount
    return () => {
      socket.off('report:created');
      socket.off('report:updated');
      socket.off('report:deleted');
      socket.off('connect');
      socket.off('disconnect');
      socket.off('error');
      socket.disconnect();
    };
  }, [queryClient]);

  return socketRef.current;
};
