# Notica Speech-to-Text Configuration Management

This module provides comprehensive management for Speech-to-Text configurations in the Notica application.

## Features

- **Configuration Management**: Create, read, update, and delete speech-to-text configurations
- **Multi-Provider Support**: Support for Google Cloud, Azure, AWS, IBM Watson, and OpenAI
- **Multi-Language Support**: Support for multiple languages including English, Vietnamese, Japanese, Korean, etc.
- **Multi-Platform Support**: Support for web, mobile, desktop, and server-side applications
- **Advanced Filtering**: Filter configurations by provider, language, platform, and status
- **Real-time Status Toggle**: Enable/disable configurations with a single click
- **JSON Configuration**: Flexible JSON-based configuration for each provider
- **Statistics Dashboard**: View configuration statistics and usage metrics

## Components

### SpeechToTextConfigManagement
Main component for managing speech-to-text configurations.

```tsx
import { SpeechToTextConfigManagement } from '@/apps/notica';

<SpeechToTextConfigManagement environment="development" />
```

### SpeechToTextConfigFilterComponent
Filter component for advanced configuration filtering.

```tsx
import { SpeechToTextConfigFilterComponent } from '@/apps/notica';

<SpeechToTextConfigFilterComponent
  onFilterChange={handleFilterChange}
  onReset={handleFilterReset}
  loading={loading}
/>
```

### SpeechToTextConfigPage
Complete page component with filtering and statistics.

```tsx
import { SpeechToTextConfigPage } from '@/apps/notica';

<SpeechToTextConfigPage environment="development" />
```

## Hooks

### useSpeechToTextConfigs
Hook for managing multiple configurations with filtering and pagination.

```tsx
import { useSpeechToTextConfigs } from '@/apps/notica';

const {
  configs,
  loading,
  error,
  filter,
  pagination,
  fetchConfigs,
  updateFilter,
  resetFilter
} = useSpeechToTextConfigs({ page: 1, limit: 10 });
```

### useCreateSpeechToTextConfig
Hook for creating new configurations.

```tsx
import { useCreateSpeechToTextConfig } from '@/apps/notica';

const { createConfig, loading, error } = useCreateSpeechToTextConfig();
```

### useUpdateSpeechToTextConfig
Hook for updating existing configurations.

```tsx
import { useUpdateSpeechToTextConfig } from '@/apps/notica';

const { updateConfig, loading, error } = useUpdateSpeechToTextConfig();
```

### useDeleteSpeechToTextConfig
Hook for deleting configurations.

```tsx
import { useDeleteSpeechToTextConfig } from '@/apps/notica';

const { deleteConfig, loading, error } = useDeleteSpeechToTextConfig();
```

### useToggleSpeechToTextConfig
Hook for toggling configuration active status.

```tsx
import { useToggleSpeechToTextConfig } from '@/apps/notica';

const { toggleActive, loading, error } = useToggleSpeechToTextConfig();
```

## Types

### SpeechToTextConfig
Main configuration interface.

```tsx
interface SpeechToTextConfig {
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
```

### CreateSpeechToTextConfigRequest
Interface for creating new configurations.

```tsx
interface CreateSpeechToTextConfigRequest {
  language: string;
  provider: string;
  platform: string;
  name: string;
  description: string;
  config: Record<string, any>;
  isActive: boolean;
  rest: string;
}
```

### SpeechToTextConfigFilter
Interface for filtering configurations.

```tsx
interface SpeechToTextConfigFilter {
  page?: number;
  limit?: number;
  language?: string;
  provider?: string;
  platform?: string;
  isActive?: boolean;
  search?: string;
}
```

## Service

### speechToTextService
Service class for API operations.

```tsx
import { speechToTextService } from '@/apps/notica';

// Get configurations
const configs = await speechToTextService.getConfigurations(filter);

// Create configuration
const newConfig = await speechToTextService.createConfiguration(data);

// Update configuration
const updatedConfig = await speechToTextService.updateConfiguration(data);

// Delete configuration
await speechToTextService.deleteConfiguration(id);

// Toggle active status
const toggledConfig = await speechToTextService.toggleActiveStatus(id);
```

## Usage Example

```tsx
import React from 'react';
import { SpeechToTextConfigPage } from '@/apps/notica';

export default function NoticaApp() {
  return (
    <div>
      <SpeechToTextConfigPage environment="development" />
    </div>
  );
}
```

## Configuration Fields

- **language**: Language code (e.g., 'en-US', 'vi-VN')
- **provider**: Service provider (e.g., 'google', 'azure', 'aws')
- **platform**: Target platform (e.g., 'web', 'mobile', 'desktop')
- **name**: Configuration name
- **description**: Configuration description
- **config**: JSON configuration object
- **isActive**: Boolean status
- **rest**: Additional configuration string

## Supported Providers

- Google Cloud Speech-to-Text
- Azure Cognitive Services
- Amazon Transcribe
- IBM Watson Speech
- OpenAI Whisper

## Supported Languages

- English (US)
- Vietnamese
- Japanese
- Korean
- Chinese (Simplified)
- Spanish
- French
- German

## Supported Platforms

- Web Application
- Mobile App
- Desktop App
- Server-side
