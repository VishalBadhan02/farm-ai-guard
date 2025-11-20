import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { UploadPhoto } from '@/components/UploadPhoto';
import { DiagnosisDialog } from '@/components/DiagnosisDialog';
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
import { MediaService } from '@/services/mediaService';

export const NewReport = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [cropType, setCropType] = useState('');
  const [location, setLocation] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [showDiagnosisDialog, setShowDiagnosisDialog] = useState(false);

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

    try {
      // 1) Build metadata for presigned URL request
      const filesMeta = files.map((f: File, idx: number) => ({
        mimetype: f.type || 'image/png',
        originalName: f.name || `captured_${idx}.png`,
      }));

      // request body shape should match your backend (folder, files, data)
      const requestBody = {
        folder: "disease-media",
        files: filesMeta,
        data: {
          // pass any conversation/tempId if needed by backend
          // conversationId: currentConversationId,
          // tempId: tempId
        }
      };

      // 2) Ask backend to generate presigned URLs for all files at once
      // adapt generateMultipleURLs to your existing wrapper (generateURL / MediaService.generateUrl)
      const urlResponse = await MediaService.generateUrl(requestBody); // or await MediaService.generateUrl(requestBody)

      if (!urlResponse?.status) {
        throw new Error('Failed to generate presigned URLs');
      }
      const urls = urlResponse?.data.urls;

      if (!Array.isArray(urls) || urls.length !== files.length) {
        throw new Error('Mismatch between files and presigned URLs returned');
      }

      // 3) Upload files to S3 using the returned presigned URLs (PUT)
      // Optionally track per-file progress by using XMLHttpRequest or fetch streams; here we use fetch for simplicity.
      await Promise.all(urls.map(async (entry: { uploadUrl: string; key: string }, i: number) => {
        const file = files[i];
        const uploadUrl = entry.uploadUrl;

        // Use fetch PUT to upload the file/blob directly to S3
        const res = await fetch(uploadUrl, {
          method: 'PUT',
          body: file,
          // Note: Do NOT set Content-Type header here for some S3 presigned setups; if necessary, ensure backend included ContentType in presigned policy.
        });

        if (!res.ok) {
          // Attempt to log body text for easier debugging
          const txt = await res.text().catch(() => '');
          throw new Error(`S3 upload failed for file ${file.name}. status=${res.status} ${txt}`);
        }
      }));

      // 4) Collect s3Keys and call analysis endpoint
      const s3Keys = urls.map((u: { key: string }) => u.key);

      // Build payload for analysis endpoint - adapt to what diseaseService expects
      const payload = {
        s3Keys,
        bucket: "disease-modal",           // array of uploaded keys on S3
        cropType,
        location: location || undefined,
        notes: additionalNotes || undefined,
        // any other metadata you need (e.g., conversationId, userId)
      };

      // Call analyze API — assume it accepts JSON with s3Keys and returns result object
      const result = await diseaseService.analyzeCropImage(payload);
      // console.log(result)
      // Handle result (adapt to the shape returned by your API)
      setDiagnosis(result.data);
      setShowDiagnosisDialog(true);
      toast({
        title: 'Analysis Complete!',
        description: `Detected: ${result.diseaseName} with ${(result.confidence * 100).toFixed(1)}% confidence`,
      });

    } catch (error: any) {
      console.error('handleAnalyze error:', error);
      toast({
        title: 'Analysis Failed',
        description: error.response?.data?.message || error.message || 'Failed to analyze crop images. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };


  const handleSaveReport = async () => {
    if (!diagnosis) return;

    setIsSaving(true);
   

    const formd = {
      cropType,
      diseaseName: diagnosis.diseaseName,
      confidence: diagnosis.confidence.toString(),
      severity: diagnosis.severity,
      description: diagnosis.description,
      treatment: diagnosis.treatment,
      location: location,
      notes: additionalNotes,
      imageKey: diagnosis.ImageKey
    }
    try {
      await reportService.createReport(formd);

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

            {/* Action Buttons - Show after diagnosis */}
            {diagnosis && (
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
                    setShowDiagnosisDialog(false);
                    setFiles([]);
                    setCropType('');
                    setLocation('');
                    setAdditionalNotes('');
                  }}
                >
                  New Analysis
                </Button>
              </div>
            )}

            {/* Diagnosis Dialog */}
            <DiagnosisDialog
              open={showDiagnosisDialog}
              onOpenChange={setShowDiagnosisDialog}
              diagnosis={diagnosis}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
