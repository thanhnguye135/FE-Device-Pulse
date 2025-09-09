// Speech-to-Text Configuration Types
export interface SpeechToTextConfig {
  id?: string;
  language: string;
  provider: string;
  platform: string;
  name: string;
  description: string;
  config: Record<string, any>; // JSON configuration
  isActive: boolean;
  rest: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSpeechToTextConfigRequest {
  language: string;
  provider: string;
  platform: string;
  name: string;
  description: string;
  config: Record<string, any>;
  isActive: boolean;
  rest: string;
}

export interface UpdateSpeechToTextConfigRequest
  extends Partial<CreateSpeechToTextConfigRequest> {
  id: string;
}

export interface SpeechToTextConfigFilter {
  page?: number;
  limit?: number;
  language?: string;
  provider?: string;
  platform?: string;
  isActive?: boolean;
  search?: string;
}

export interface SpeechToTextConfigResponse {
  data: SpeechToTextConfig[];
  total: number;
  page: number;
  limit: number;
}

// Available options for dropdowns
export interface LanguageOption {
  value: string;
  label: string;
  code: string;
}

export interface ProviderOption {
  value: string;
  label: string;
  description?: string;
}

export interface PlatformOption {
  value: string;
  label: string;
  description?: string;
}
