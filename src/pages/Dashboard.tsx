import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { StatsCard } from '@/components/StatsCard';
import { ReportCard } from '@/components/ReportCard';
import { Button } from '@/components/ui/button';
import { useReports, useReportStats } from '@/hooks/useReports';
import { useRealtime } from '@/hooks/useRealtime';
import { AlertTriangle, FileText, CheckCircle, TrendingUp, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  useRealtime(); // Connect to real-time updates
  
  const { data: stats, isLoading: statsLoading } = useReportStats();
  const { data: recentReports, isLoading: reportsLoading } = useReports();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 bg-gradient-card py-8">
        <div className="container px-4">
          {/* Header Section */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="mt-1 text-muted-foreground">
                Monitor your crop health and recent diagnoses
              </p>
            </div>
            <Button asChild>
              <Link to="/reports/new">
                <Plus className="mr-2 h-4 w-4" />
                New Report
              </Link>
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Reports"
              value={statsLoading ? '...' : stats?.totalReports || 0}
              icon={FileText}
              description="All disease reports"
            />
            <StatsCard
              title="Pending Review"
              value={statsLoading ? '...' : stats?.pendingReports || 0}
              icon={TrendingUp}
              description="Awaiting verification"
            />
            <StatsCard
              title="Critical Cases"
              value={statsLoading ? '...' : stats?.criticalReports || 0}
              icon={AlertTriangle}
              description="Requires immediate attention"
            />
            <StatsCard
              title="Recent Diagnoses"
              value={statsLoading ? '...' : stats?.recentDiagnoses || 0}
              icon={CheckCircle}
              description="Last 7 days"
            />
          </div>

          {/* Recent Reports */}
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Recent Reports</h2>
              <Button variant="ghost" asChild>
                <Link to="/reports">View All</Link>
              </Button>
            </div>

            {reportsLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-96 animate-pulse rounded-lg bg-muted" />
                ))}
              </div>
            ) : recentReports && recentReports.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {recentReports.slice(0, 6).map((report) => (
                  <ReportCard
                    key={report.id}
                    report={report}
                    onView={(report) => window.location.href = `/reports/${report.id}`}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-lg bg-muted/30 p-12 text-center">
                <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold text-foreground">No Reports Yet</h3>
                <p className="mb-4 text-muted-foreground">
                  Start by creating your first disease report
                </p>
                <Button asChild>
                  <Link to="/reports/new">Create Report</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
