import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ReportCard } from '@/components/ReportCard';
import { StatsCard } from '@/components/StatsCard';
import { Button } from '@/components/ui/button';
import { useReports, useApproveReport, useReportStats } from '@/hooks/useReports';
import { useRealtime } from '@/hooks/useRealtime';
import { AlertTriangle, FileText, CheckCircle, XCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const Admin = () => {
  useRealtime();
  
  const { data: stats, isLoading: statsLoading } = useReportStats();
  const { data: pendingReports, isLoading: reportsLoading } = useReports({ status: 'pending' });
  const approveMutation = useApproveReport();

  const handleApprove = (id: string) => {
    approveMutation.mutate(id);
  };

  const handleReject = (id: string) => {
    toast({
      title: 'Report rejected',
      description: 'The report has been rejected',
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 bg-gradient-card py-8">
        <div className="container px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="mt-1 text-muted-foreground">
              Review and manage disease reports
            </p>
          </div>

          {/* Stats Grid */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Reports"
              value={statsLoading ? '...' : stats?.totalReports || 0}
              icon={FileText}
              description="All reports"
            />
            <StatsCard
              title="Pending Review"
              value={statsLoading ? '...' : stats?.pendingReports || 0}
              icon={AlertTriangle}
              description="Awaiting approval"
            />
            <StatsCard
              title="Approved"
              value={statsLoading ? '...' : (stats?.totalReports || 0) - (stats?.pendingReports || 0)}
              icon={CheckCircle}
              description="Verified reports"
            />
            <StatsCard
              title="Critical"
              value={statsLoading ? '...' : stats?.criticalReports || 0}
              icon={XCircle}
              description="Urgent attention"
            />
          </div>

          {/* Pending Reports */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground">Pending Reports</h2>
              <p className="text-muted-foreground">Review and approve disease reports</p>
            </div>

            {reportsLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-96 animate-pulse rounded-lg bg-muted" />
                ))}
              </div>
            ) : pendingReports && pendingReports.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {pendingReports.map((report) => (
                  <ReportCard
                    key={report.id}
                    report={report}
                    showActions
                    onView={(report) => window.location.href = `/reports/${report.id}`}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-lg bg-muted/30 p-12 text-center">
                <CheckCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold text-foreground">All Caught Up!</h3>
                <p className="text-muted-foreground">
                  No pending reports to review at the moment
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
