# Device Pulse API Manager

A unified tool for testing and managing device APIs across multiple environments and applications.

## 🚀 Recent Refactoring (Scalable Architecture)

The application has been completely refactored to improve scalability, maintainability, and proper environment variable handling.

### ✨ Key Improvements

1. **Proper Environment Variable Handling**
   - Environment variables are now properly handled on the server side
   - Client-side components can access configuration through secure API routes
   - No more `process.env` usage in client components

2. **Modular Architecture**
   - Separated concerns into reusable modules
   - Type-safe interfaces and configurations
   - Service layer for API operations

3. **Component-Based Structure**
   - Broke down the large page component into smaller, manageable components
   - Reusable hooks for state management
   - Better separation of UI and logic

### 📁 Project Structure

```
src/
├── app/
│   ├── api/config/route.ts    # API route for environment configuration
│   ├── layout.tsx
│   └── page.tsx               # Main application component
├── components/
│   ├── ConfigurationSteps.tsx # Step-by-step configuration UI
│   ├── EndpointCard.tsx       # Individual endpoint interface
│   └── ApiResponses.tsx       # API response display
├── config/
│   ├── constants.ts           # Application constants
│   ├── endpoints.ts           # API endpoint definitions
│   └── queryParams.ts         # Query parameter configurations
├── hooks/
│   ├── useConfig.ts           # Configuration management hook
│   └── useApiCalls.ts         # API call management hook
├── services/
│   ├── configService.ts       # Configuration service
│   └── apiService.ts          # API service layer
├── types/
│   └── api.ts                 # TypeScript type definitions
└── utils/
    └── appHelpers.ts          # Helper utility functions
```

### 🔧 Environment Configuration

The application now uses a proper environment configuration system:

**`.env` file:**
```env
# Development Environment Configuration
BE_NOTICA_DEV=http://localhost:3005
TOKEN_URL_DEV=https://id.dev.apero.vn

# Production Environment Configuration
BE_NOTICA_PROD=https://api-notica.apero.vn
TOKEN_URL_PROD=https://llm-account-service.apero.vn

# Default Environment
NODE_ENV=development
```

**Configuration Access:**
- Environment variables are accessed through `/api/config` endpoint
- Client components use the `useConfig` hook to access configuration
- Automatic fallback to default values if environment variables are not set

### 🔄 State Management

- **useConfig**: Manages environment configuration and API URLs
- **useApiCalls**: Handles API calls, parameter management, and response state
- All state is properly typed with TypeScript interfaces

### 🧩 Benefits of Refactoring

1. **Scalability**: Easy to add new apps, modules, and endpoints
2. **Maintainability**: Clear separation of concerns and modular structure
3. **Type Safety**: Full TypeScript support with proper interfaces
4. **Security**: Environment variables handled securely on server side
5. **Reusability**: Components and services can be easily reused
6. **Testing**: Modular structure makes unit testing easier

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

## Usage

1. **Select App Type**: Choose between Notica or Other App
2. **Select Module**: Pick the specific module you want to test
3. **Choose Environment**: Select Development or Production
4. **Enter Device ID**: Provide your device identifier
5. **Execute APIs**: Fill in parameters and execute API calls

## Adding New Endpoints

To add new endpoints:

1. Update `src/config/endpoints.ts` with new endpoint definitions
2. Add query parameter definitions in `src/config/queryParams.ts`
3. Update the helper functions in `src/utils/appHelpers.ts` if needed

## Contributing

The new modular structure makes it easy to contribute:
- Add new components in `src/components/`
- Create new services in `src/services/`
- Add utility functions in `src/utils/`
- Update types in `src/types/`
