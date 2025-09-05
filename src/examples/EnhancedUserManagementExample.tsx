// Example usage of the Enhanced User Management component with React Hook Form
import React from "react";
import { EnhancedUserManagementUpdated } from "../components/EnhancedUserManagement.updated";

const App: React.FC = () => {
  // User selection handler
  const handleUserSelect = (user: any) => {
    console.log("Selected user:", user);
    // Handle user selection logic here
  };

  return (
    <div style={{ padding: 24 }}>
      <EnhancedUserManagementUpdated
        environment="development" // or "production", "staging"
        onUserSelect={handleUserSelect}
        useRefactoredVersion={true} // Use the new React Hook Form version
        enableDebugMode={false} // Set to true for development debugging
      />
    </div>
  );
};

export default App;

// Alternative usage - Direct use of refactored component
import { RefactoredEnhancedUserManagement } from "../components/EnhancedUserManagement.updated";

const DirectUsageExample: React.FC = () => {
  return (
    <RefactoredEnhancedUserManagement
      environment="production"
      enableDebugMode={false}
    />
  );
};

// Alternative usage - Original component for comparison
import { OriginalEnhancedUserManagement } from "../components/EnhancedUserManagement.updated";

const OriginalUsageExample: React.FC = () => {
  return <OriginalEnhancedUserManagement environment="development" />;
};
