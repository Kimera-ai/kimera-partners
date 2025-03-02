
import { GenerationJobType } from '@/components/prompt-maker/GenerationJob';

export interface JobStatusResponse {
  status: string;
  result?: string;
  progress?: {
    step: number;
    total: number;
  };
}

export interface JobPollingConfig {
  jobId: string;
  apiJobId: string;
  imageIndex: number;
  jobPrompt: string;
  jobStyle: string;
  jobRatio: string;
  jobLoraScale: string;
}
