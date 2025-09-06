import { useCallback, useRef, useEffect } from "react";

interface UseScrollLoadingProps {
  hasNextPage: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  threshold?: number; // Distance from bottom to trigger loading (in pixels)
}

interface UseScrollLoadingReturn {
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  handleScroll: (e: React.UIEvent<HTMLDivElement>) => void;
}

/**
 * Custom hook to handle scroll-based pagination loading
 * Automatically loads more data when user scrolls near the bottom
 */
export const useScrollLoading = ({
  hasNextPage,
  isLoading,
  onLoadMore,
  threshold = 100,
}: UseScrollLoadingProps): UseScrollLoadingReturn => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget;
      if (!target || isLoading || !hasNextPage) {
        return;
      }

      // Calculate if we're near the bottom
      const { scrollTop, scrollHeight, clientHeight } = target;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - threshold;

      if (isNearBottom) {
        onLoadMore();
      }
    },
    [hasNextPage, isLoading, onLoadMore, threshold]
  );

  // Auto-scroll effect for smooth loading experience
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Maintain scroll position when new items are loaded
    let shouldMaintainPosition = false;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;

    if (scrollTop > 0) {
      shouldMaintainPosition = true;
    }

    // Small delay to ensure DOM updates are complete
    const timeout = setTimeout(() => {
      if (shouldMaintainPosition && container.scrollHeight > scrollHeight) {
        const newScrollTop =
          scrollTop + (container.scrollHeight - scrollHeight);
        container.scrollTop = newScrollTop;
      }
    }, 50);

    return () => clearTimeout(timeout);
  }, []);

  return {
    scrollContainerRef,
    handleScroll,
  };
};
