import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { UploadPhoto } from '@/components/UploadPhoto';
import { DiagnosisCard } from '@/components/DiagnosisCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { diseaseService } from '@/services/diseaseService';
import { reportService } from '@/services/reportService';
import { DiagnosisResult } from '@/types';
import { toast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Save } from 'lucide-react';

export const NewReport = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [cropType, setCropType] = useState('');
  const [location, setLocation] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);

  const handleAnalyze = async () => {
    if (files.length === 0) {
      toast({
        title: 'No images selected',
        description: 'Please upload at least one crop image',
        variant: 'destructive',
      });
      return;
    }

    if (!cropType.trim()) {
      toast({
        title: 'Crop type required',
        description: 'Please specify the type of crop',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);
    const formData = new FormData();
    
    files.forEach((file) => {
      formData.append('images', file);
    });
    formData.append('cropType', cropType);
    if (location) formData.append('location', location);
    if (additionalNotes) formData.append('notes', additionalNotes);

    try {
      const result = await diseaseService.analyzeCropImage(formData);
      setDiagnosis(result);
      
      toast({
        title: 'Analysis Complete!',
        description: `Detected: ${result.diseaseName} with ${(result.confidence * 100).toFixed(1)}% confidence`,
      });
    } catch (error: any) {
      toast({
        title: 'Analysis Failed',
        description: error.response?.data?.message || 'Failed to analyze crop images. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveReport = async () => {
    if (!diagnosis) return;

    setIsSaving(true);
    const formData = new FormData();
    
    files.forEach((file) => {
      formData.append('images', file);
    });
    
    formData.append('cropType', cropType);
    formData.append('diseaseName', diagnosis.diseaseName);
    formData.append('confidence', diagnosis.confidence.toString());
    formData.append('severity', diagnosis.severity);
    formData.append('description', diagnosis.description);
    formData.append('treatment', diagnosis.treatment);
    
    if (location) formData.append('location', location);
    if (additionalNotes) formData.append('notes', additionalNotes);

    try {
      await reportService.createReport(formData);
      
      toast({
        title: 'Report Saved!',
        description: 'Your disease report has been saved successfully',
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Save Failed',
        description: error.response?.data?.message || 'Failed to save report. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 bg-gradient-card py-8">
        <div className="container max-w-4xl px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">AI Crop Diagnosis</h1>
            <p className="mt-1 text-muted-foreground">
              Upload images of your crop to get instant disease diagnosis and treatment recommendations
            </p>
          </div>

          <div className="space-y-6">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle>Step 1: Upload Crop Images</CardTitle>
                <CardDescription>
                  Take clear photos of affected plants, leaves, or crops. Multiple angles help improve accuracy.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UploadPhoto
                  onFilesSelect={setFiles}
                  maxFiles={5}
                  accept="image/*"
                />
              </CardContent>
            </Card>

            {/* Crop Details */}
            <Card>
              <CardHeader>
                <CardTitle>Step 2: Provide Crop Details</CardTitle>
                <CardDescription>
                  Help us understand your crop better for more accurate diagnosis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="cropType">Crop Type *</Label>
                  <Input
                    id="cropType"
                    placeholder="e.g., Tomato, Wheat, Rice, Cotton"
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value)}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location (Optional)</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Farm location or region"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional observations or symptoms..."
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    className="mt-1.5"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Analyze Button */}
            {!diagnosis && (
              <Button
                size="lg"
                className="w-full"
                onClick={handleAnalyze}
                disabled={isAnalyzing || files.length === 0 || !cropType.trim()}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing with AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Analyze with AI
                  </>
                )}
              </Button>
            )}

            {/* Diagnosis Results */}
            {diagnosis && (
              <>
                <Card className="border-primary/50 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      AI Diagnosis Results
                    </CardTitle>
                    <CardDescription>
                      Our AI has analyzed your crop images and detected the following disease
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DiagnosisCard diagnosis={diagnosis} />
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button
                    size="lg"
                    className="flex-1"
                    onClick={handleSaveReport}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-5 w-5" />
                        Save Report
                      </>
                    )}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => {
                      setDiagnosis(null);
                      setFiles([]);
                      setCropType('');
                      setLocation('');
                      setAdditionalNotes('');
                    }}
                  >
                    New Analysis
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
