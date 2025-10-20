import { useCallback } from 'react';

/**
 * Custom hook to ensure a minimum loading time to prevent flickering
 * @param {number} minimumTime - Minimum time in milliseconds (default: 1200ms)
 * @returns {function} Function to wrap async operations
 */
export function useMinimumLoadingTime(minimumTime = 1200) {
  const withMinimumTime = useCallback(async (asyncFunction) => {
    const startTime = Date.now();
    
    try {
      // Execute the async function
      const result = await asyncFunction();
      
      // Calculate elapsed time
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minimumTime - elapsedTime);
      
      // Wait for remaining time if needed
      if (remainingTime > 0) {
        console.log(`⏱️ Waiting ${remainingTime}ms to prevent flicker`);
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }
      
      return result;
    } catch (error) {
      // Still apply minimum time on error
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minimumTime - elapsedTime);
      
      if (remainingTime > 0) {
        console.log(`⏱️ Waiting ${remainingTime}ms on error to prevent flicker`);
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }
      
      throw error;
    }
  }, [minimumTime]);
  
  return withMinimumTime;
}

export default useMinimumLoadingTime;