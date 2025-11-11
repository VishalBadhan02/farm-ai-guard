import { DiagnosisResult } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DiagnosisCard } from '@/components/DiagnosisCard';
import { Sparkles } from 'lucide-react';

interface DiagnosisDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  diagnosis: DiagnosisResult | null;
}

export const DiagnosisDialog = ({ open, onOpenChange, diagnosis }: DiagnosisDialogProps) => {
  if (!diagnosis) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="h-6 w-6 text-primary" />
            AI Diagnosis Results
          </DialogTitle>
          <DialogDescription>
            Our AI has analyzed your crop images and detected the following disease with recommended treatment and preventive measures
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <DiagnosisCard diagnosis={diagnosis} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
