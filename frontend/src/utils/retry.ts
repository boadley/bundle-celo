/**
 * Configuration for retry mechanism
 */
export const RETRY_CONFIG = {
    maxAttempts: 10,
    delayMs: 2000,
    backoff: 1.5 // Increase delay by this factor each attempt
};

/**
 * Generic retry mechanism for async operations
 * @param operation - Function to retry
 * @param config - Retry configuration
 * @returns Promise<T>
 */
export async function withRetry<T>(
    operation: () => Promise<T>,
    config = RETRY_CONFIG
): Promise<T> {
    let lastError;
    let delay = config.delayMs;

    for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error;
            
            if (attempt === config.maxAttempts) {
                break;
            }

            // Wait with exponential backoff
            await new Promise(resolve => setTimeout(resolve, delay));
            delay = delay * config.backoff;
        }
    }

    throw lastError;
}