export interface PromptSettings {
  prompt: string;
  setPrompt: (prompt: string) => void;
  isImprovingPrompt: boolean;
  handleImprovePrompt: () => Promise<void>;
}

export interface ImageSettings {
  imagePreview: string | null;
  isUploading: boolean;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  removeImage: (e: React.MouseEvent) => void;
  uploadedImageUrl: string | null;
}

export interface GenerationSettings {
  workflow: string;
  setWorkflow: (workflow: string) => void;
  ratio: string;
  setRatio: (ratio: string) => void;
  style: string;
  setStyle: (style: string) => void;
  loraScale: string;
  setLoraScale: (loraScale: string) => void;
  seed: string;
  setSeed: (seed: string) => void;
  numberOfImages: string;
  setNumberOfImages: (numberOfImages: string) => void;
}

export interface CreditInfo {
  credits: number | null;
  isLoadingCredits: boolean;
  CREDITS_PER_GENERATION: number;
}

export interface GenerationState {
  isProcessing: boolean;
  handleGenerate: () => Promise<void>;
}

export interface HistoryRefreshProps {
  isRefreshingHistory: boolean;
  manualRefreshHistory: () => Promise<void>;
}
