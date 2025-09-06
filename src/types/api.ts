export interface ApiEndpoint {
  name: string;
  path: string;
  method: string;
  description: string;
}

export interface ApiModule {
  value: string;
  label: string;
  category: string;
}

export interface ApiApp {
  value: string;
  label: string;
  bundleId: string;
}

export interface Environment {
  value: string;
  label: string;
}

export interface EnvironmentConfig {
  apiUrl: string;
  tokenUrl: string;
}

export interface AppConfig {
  environments: {
    local: EnvironmentConfig;
    development: EnvironmentConfig;
    production: EnvironmentConfig;
  };
  defaultEnvironment: string;
}

export interface QueryParam {
  name: string;
  defaultValue: string;
  isRequired: boolean;
  description: string;
}

export interface ApiResponse {
  [key: string]: unknown;
}

export interface EndpointParams {
  [key: string]: Record<string, string>;
}

export interface LoadingState {
  [key: string]: boolean;
}
