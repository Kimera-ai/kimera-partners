import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const EventPhotoUploader = ({ onUploadComplete }: { onUploadComplete: () => void }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) {
      toast({
        title: "Missing information",
        description: "Please provide a title and select an image.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      // Upload image to storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('event_photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create database record
      const { error: dbError } = await supabase
        .from('event_photos')
        .insert({
          title,
          description,
          image_path: filePath,
        });

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Event photo uploaded successfully!",
      });

      // Reset form
      setTitle("");
      setDescription("");
      setFile(null);
      onUploadComplete();

    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Error",
        description: "Failed to upload event photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          type="text"
          placeholder="Photo title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-white/5 border-white/10"
        />
      </div>
      <div>
        <Textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-white/5 border-white/10"
        />
      </div>
      <div>
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="bg-white/5 border-white/10"
        />
      </div>
      <Button 
        type="submit" 
        disabled={isUploading || !file || !title}
        className="w-full"
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Upload Photo
          </>
        )}
      </Button>
    </form>
  );
};