import {
  SpeechToTextConfig,
  CreateSpeechToTextConfigRequest,
  UpdateSpeechToTextConfigRequest,
  SpeechToTextConfigFilter,
  SpeechToTextConfigResponse,
} from "../types/speechToText";

// Mock data for development
const mockSpeechToTextConfigs: SpeechToTextConfig[] = [
  {
    id: "1",
    language: "en-US",
    provider: "google",
    platform: "web",
    name: "Google Web STT",
    description: "Google Speech-to-Text for web applications",
    config: {
      sampleRate: 44100,
      encoding: "LINEAR16",
      enableAutomaticPunctuation: true,
      model: "latest_long",
    },
    isActive: true,
    rest: "Additional configuration for Google STT",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    language: "vi-VN",
    provider: "azure",
    platform: "mobile",
    name: "Azure Mobile STT",
    description: "Azure Cognitive Services for mobile apps",
    config: {
      region: "southeastasia",
      subscriptionKey: "your-key-here",
      format: "detailed",
    },
    isActive: true,
    rest: "Azure specific configuration",
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-02T00:00:00Z",
  },
  {
    id: "3",
    language: "ja-JP",
    provider: "aws",
    platform: "desktop",
    name: "AWS Desktop STT",
    description: "Amazon Transcribe for desktop applications",
    config: {
      region: "ap-southeast-1",
      languageCode: "ja-JP",
      mediaFormat: "wav",
    },
    isActive: false,
    rest: "AWS specific configuration",
    createdAt: "2024-01-03T00:00:00Z",
    updatedAt: "2024-01-03T00:00:00Z",
  },
];

class SpeechToTextService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
  }

  // Get all speech-to-text configurations with filtering
  async getConfigurations(
    filter: SpeechToTextConfigFilter = {}
  ): Promise<SpeechToTextConfigResponse> {
    try {
      // In a real application, this would be an API call
      // For now, we'll simulate with mock data
      let filteredConfigs = [...mockSpeechToTextConfigs];

      // Apply filters
      if (filter.language) {
        filteredConfigs = filteredConfigs.filter((config) =>
          config.language.toLowerCase().includes(filter.language!.toLowerCase())
        );
      }

      if (filter.provider) {
        filteredConfigs = filteredConfigs.filter((config) =>
          config.provider.toLowerCase().includes(filter.provider!.toLowerCase())
        );
      }

      if (filter.platform) {
        filteredConfigs = filteredConfigs.filter((config) =>
          config.platform.toLowerCase().includes(filter.platform!.toLowerCase())
        );
      }

      if (filter.isActive !== undefined) {
        filteredConfigs = filteredConfigs.filter(
          (config) => config.isActive === filter.isActive
        );
      }

      if (filter.search) {
        const searchTerm = filter.search.toLowerCase();
        filteredConfigs = filteredConfigs.filter(
          (config) =>
            config.name.toLowerCase().includes(searchTerm) ||
            config.description.toLowerCase().includes(searchTerm) ||
            config.language.toLowerCase().includes(searchTerm) ||
            config.provider.toLowerCase().includes(searchTerm) ||
            config.platform.toLowerCase().includes(searchTerm)
        );
      }

      // Apply pagination
      const page = filter.page || 1;
      const limit = filter.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedConfigs = filteredConfigs.slice(startIndex, endIndex);

      return {
        data: paginatedConfigs,
        total: filteredConfigs.length,
        page,
        limit,
      };
    } catch (error) {
      console.error("Error fetching speech-to-text configurations:", error);
      throw new Error("Failed to fetch speech-to-text configurations");
    }
  }

  // Get a single configuration by ID
  async getConfigurationById(id: string): Promise<SpeechToTextConfig> {
    try {
      const config = mockSpeechToTextConfigs.find((c) => c.id === id);
      if (!config) {
        throw new Error("Configuration not found");
      }
      return config;
    } catch (error) {
      console.error("Error fetching speech-to-text configuration:", error);
      throw new Error("Failed to fetch speech-to-text configuration");
    }
  }

  // Create a new configuration
  async createConfiguration(
    data: CreateSpeechToTextConfigRequest
  ): Promise<SpeechToTextConfig> {
    try {
      const newConfig: SpeechToTextConfig = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockSpeechToTextConfigs.push(newConfig);
      return newConfig;
    } catch (error) {
      console.error("Error creating speech-to-text configuration:", error);
      throw new Error("Failed to create speech-to-text configuration");
    }
  }

  // Update an existing configuration
  async updateConfiguration(
    data: UpdateSpeechToTextConfigRequest
  ): Promise<SpeechToTextConfig> {
    try {
      const index = mockSpeechToTextConfigs.findIndex((c) => c.id === data.id);
      if (index === -1) {
        throw new Error("Configuration not found");
      }

      const updatedConfig: SpeechToTextConfig = {
        ...mockSpeechToTextConfigs[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };

      mockSpeechToTextConfigs[index] = updatedConfig;
      return updatedConfig;
    } catch (error) {
      console.error("Error updating speech-to-text configuration:", error);
      throw new Error("Failed to update speech-to-text configuration");
    }
  }

  // Delete a configuration
  async deleteConfiguration(id: string): Promise<void> {
    try {
      const index = mockSpeechToTextConfigs.findIndex((c) => c.id === id);
      if (index === -1) {
        throw new Error("Configuration not found");
      }

      mockSpeechToTextConfigs.splice(index, 1);
    } catch (error) {
      console.error("Error deleting speech-to-text configuration:", error);
      throw new Error("Failed to delete speech-to-text configuration");
    }
  }

  // Toggle active status
  async toggleActiveStatus(id: string): Promise<SpeechToTextConfig> {
    try {
      const config = await this.getConfigurationById(id);
      return await this.updateConfiguration({
        id,
        isActive: !config.isActive,
      });
    } catch (error) {
      console.error("Error toggling active status:", error);
      throw new Error("Failed to toggle active status");
    }
  }
}

export const speechToTextService = new SpeechToTextService();
