
import React from "react";
import { GenerationJobComponent, GenerationJobType, GeneratedImageData } from "./GenerationJob";

interface JobsContainerProps {
  generationJobs: GenerationJobType[];
  formatTime: (milliseconds: number) => string;
  handleDownload: (imageUrl: string) => Promise<void>;
  onImageClick: (imageData: GeneratedImageData) => void;
  jobRefs: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>;
}

export const JobsContainer: React.FC<JobsContainerProps> = ({
  generationJobs,
  formatTime,
  handleDownload,
  onImageClick,
  jobRefs
}) => {
  return (
    <div className="space-y-4">
      {generationJobs.map((job) => (
        <GenerationJobComponent 
          key={job.id} 
          job={job} 
          formatTime={formatTime} 
          handleDownload={handleDownload} 
          onImageClick={onImageClick}
          ref={(el) => { jobRefs.current[job.id] = el; }}
        />
      ))}
    </div>
  );
};
