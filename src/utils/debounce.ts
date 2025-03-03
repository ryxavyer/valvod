/**
 * Creates a debounced version of a function that delays its execution
 * until after the specified delay has elapsed since the last time it was invoked.
 *
 * @param fn - The function to debounce.
 * @param delay - The debounce delay in milliseconds.
 * @returns A debounced version of the function.
 */
export function debounce<T extends (...args: any[]) => void>(
    fn: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timerId: ReturnType<typeof setTimeout> | null = null;
    return (...args: Parameters<T>): void => {
        if (timerId !== null) {
            clearTimeout(timerId);
        }
        timerId = setTimeout(() => {
            fn(...args);
        }, delay);
    };
}
