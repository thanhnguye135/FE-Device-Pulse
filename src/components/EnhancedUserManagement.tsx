// This file has been refactored for better maintainability and performance
// The original 2700+ line file has been broken down into smaller, manageable components:
//
// - FilesFilter, FoldersFilter -> /filters/
// - useUserDataLoader -> /hooks/
// - DataTableSection -> separate component
// - UserManagementRefactored -> main component
//
// This eliminates the infinite fetch issues and makes the code much more maintainable.

export { default } from "./UserManagementRefactored";
