import { DiagnosisResult } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

interface DiagnosisCardProps {
  diagnosis: DiagnosisResult;
}

export const DiagnosisCard = ({ diagnosis }: DiagnosisCardProps) => {
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

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low':
        return <CheckCircle className="h-4 w-4" />;
      case 'medium':
        return <TrendingUp className="h-4 w-4" />;
      case 'high':
      case 'critical':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Card className="shadow-card hover:shadow-lg-custom transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl">{diagnosis?.diseaseName}</CardTitle>
          <Badge className={getSeverityColor(diagnosis?.severity)}>
            <span className="flex items-center gap-1">
              {getSeverityIcon(diagnosis?.severity)}
              {diagnosis?.severity.toUpperCase()}
            </span>
          </Badge>
        </div>
        <div className="mt-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Confidence:</span>
            <div className="flex items-center gap-2">
              <div className="h-2 w-32 rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-primary transition-all"
                  style={{ width: `${diagnosis?.confidence}%` }}
                />
              </div>
              <span className="font-medium text-foreground">
                {/* {(diagnosis?.confidence * 100).toFixed(1)}% */}
                {diagnosis?.confidence }
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="mb-2 text-sm font-semibold text-foreground">Description</h4>
          <p className="text-sm text-muted-foreground">{diagnosis?.description}</p>
        </div>

        <div>
          <h4 className="mb-2 text-sm font-semibold text-foreground">Treatment</h4>
          <p className="text-sm text-muted-foreground">{diagnosis?.treatment}</p>
        </div>

        {diagnosis?.preventiveMeasures && diagnosis?.preventiveMeasures.length > 0 && (
          <div>
            <h4 className="mb-2 text-sm font-semibold text-foreground">Preventive Measures</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {diagnosis?.preventiveMeasures.map((measure, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
                  <span>{measure}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {diagnosis?.affectedCrops && diagnosis?.affectedCrops.length > 0 && (
          <div>
            <h4 className="mb-2 text-sm font-semibold text-foreground">Affected Crops</h4>
            <div className="flex flex-wrap gap-2">
              {diagnosis?.affectedCrops.map((crop, index) => (
                <Badge key={index} variant="secondary">
                  {crop}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
