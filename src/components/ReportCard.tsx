import { DiseaseReport } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, User as UserIcon } from 'lucide-react';
import { format } from 'date-fns';

interface ReportCardProps {
  report: DiseaseReport;
  onView?: (report: DiseaseReport) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  showActions?: boolean;
}

export const ReportCard = ({ report, onView, onApprove, onReject, showActions = false }: ReportCardProps) => {

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-success text-success-foreground';
      case 'medium':
        return 'bg-warning text-warning-foreground';
      case 'high':
      case 'critical':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-success text-success-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'rejected':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="shadow-card hover:shadow-lg-custom transition-all duration-300 cursor-pointer" onClick={() => onView?.(report)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-foreground">{report?.diseaseName}</h3>
            <p className="text-sm text-muted-foreground">{report?.cropType}</p>
          </div>
          <div className="flex flex-col gap-2">
            <Badge className={getSeverityColor(report?.severity)}>
              {report?.severity.toUpperCase()}
            </Badge>
            <Badge className={getStatusColor(report?.status)}>
              {report?.status.toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {report?.images && report?.images.length > 0 && (
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
            <img
              src={report?.images[0]}
              alt={report?.diseaseName}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <p className="line-clamp-2 text-sm text-muted-foreground">{report?.description}</p>

        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <UserIcon className="h-3 w-3" />
            <span>{report?.userName}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-3 w-3" />
            <span>{report?.location.address || `${report?.location.lat}, ${report?.location.lng}`}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            <span>{format(new Date(report?.createdAt), 'PPP')}</span>
          </div>
        </div>

        {report?.confidence && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Confidence:</span>
            <div className="flex items-center gap-2">
              <div className="h-2 w-24 rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-primary transition-all"
                  style={{ width: `${report?.confidence}%` }}
                />
              </div>
              <span className="text-xs font-medium text-foreground">
                {(report?.confidence)}%
              </span>
            </div>
          </div>
        )}
      </CardContent>

      {showActions && report?.status === 'pending' && (
        <CardFooter className="flex gap-2">
          <Button
            size="sm"
            variant="default"
            onClick={(e) => {
              e.stopPropagation();
              onApprove?.(report?.id);
            }}
            className="flex-1"
          >
            Approve
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={(e) => {
              e.stopPropagation();
              onReject?.(report?.id);
            }}
            className="flex-1"
          >
            Reject
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
