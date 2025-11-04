import { useState } from 'react';
import { Header } from '@/components/Header';
import { MapView } from '@/components/MapView';
import { ReportCard } from '@/components/ReportCard';
import { useReports } from '@/hooks/useReports';
import { useRealtime } from '@/hooks/useRealtime';
import { DiseaseReport } from '@/types';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

export const MapPage = () => {
  useRealtime();
  
  const { data: reports = [], isLoading } = useReports();
  const [selectedReport, setSelectedReport] = useState<DiseaseReport | null>(null);

  return (
    <div className="flex h-screen flex-col">
      <Header />
      
      <main className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex h-full items-center justify-center bg-muted">
            <div className="text-center">
              <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-muted-foreground">Loading map...</p>
            </div>
          </div>
        ) : (
          <MapView
            reports={reports}
            onReportClick={(report) => setSelectedReport(report)}
          />
        )}
      </main>

      <Sheet open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Report Details</SheetTitle>
          </SheetHeader>
          {selectedReport && (
            <div className="mt-4">
              <ReportCard
                report={selectedReport}
                onView={(report) => window.location.href = `/reports/${report.id}`}
              />
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};
