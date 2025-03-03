import { useToast } from "@src/hooks/use-toast";

/**
 * Creates a throttled version of a callback function.
 * The callback will only execute up to `limit` times within each time window (`windowMs`).
 * If the limit is exceeded, the provided error message is logged.
 *
 * @param callback - The function to throttle.
 * @param limit - The number of allowed executions within the window.
 * @param errorMessage - The error message to display/log if throttled.
 * @param windowMs - The time window in milliseconds (default is 1000ms).
 * @returns A throttled version of the callback.
 * 
 * Assumes a <Toaster/> component is present in the app layout.
 */
export function throttle<T extends (...args: any[]) => void>(
    callback: T,
    limit: number,
    windowMs: number = 1000,
    errorMessage?: string
  ): (...args: Parameters<T>) => void {
    const { toast } = useToast();
    let callCount = 0;
    let windowStart = Date.now();

    return (...args: Parameters<T>): void => {
        const now = Date.now();
        // Reset the window if the time has passed.
        if (now - windowStart > windowMs) {
            callCount = 0;
            windowStart = now;
        }
        // If we're within the allowed call count, execute the callback.
        if (callCount < limit) {
            callCount++;
            callback(...args);
        } else {
            toast({
                title: "Slow down!",
                description: errorMessage || "Please wait a moment before trying again.",
                variant: "destructive",
            })
        }
    };
}
