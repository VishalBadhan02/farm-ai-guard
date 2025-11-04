import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadPhotoProps {
  onFilesSelect: (files: File[]) => void;
  maxFiles?: number;
  accept?: string;
  className?: string;
}

export const UploadPhoto = ({
  onFilesSelect,
  maxFiles = 5,
  accept = 'image/*',
  className,
}: UploadPhotoProps) => {
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const newFiles = [...files, ...selectedFiles].slice(0, maxFiles);
    
    setFiles(newFiles);
    onFilesSelect(newFiles);

    // Create preview URLs
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    
    setFiles(newFiles);
    setPreviews(newPreviews);
    onFilesSelect(newFiles);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className={cn('space-y-4', className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {previews.length === 0 ? (
        <Card
          className="flex cursor-pointer flex-col items-center justify-center border-2 border-dashed border-border bg-muted/30 p-12 transition-colors hover:border-primary hover:bg-muted/50"
          onClick={handleClick}
        >
          <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="mb-2 text-sm font-medium text-foreground">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-muted-foreground">
            PNG, JPG, JPEG (max {maxFiles} files)
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {previews.map((preview, index) => (
            <Card key={index} className="group relative overflow-hidden">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="aspect-square w-full object-cover"
              />
              <button
                onClick={() => removeFile(index)}
                className="absolute right-2 top-2 rounded-full bg-destructive p-1.5 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            </Card>
          ))}
          {previews.length < maxFiles && (
            <Card
              className="flex aspect-square cursor-pointer items-center justify-center border-2 border-dashed border-border bg-muted/30 transition-colors hover:border-primary hover:bg-muted/50"
              onClick={handleClick}
            >
              <div className="text-center">
                <ImageIcon className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Add more</p>
              </div>
            </Card>
          )}
        </div>
      )}

      {previews.length > 0 && (
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>
            {previews.length} of {maxFiles} files selected
          </span>
          <Button variant="ghost" size="sm" onClick={handleClick}>
            Change files
          </Button>
        </div>
      )}
    </div>
  );
};
