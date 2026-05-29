import { ref, watch } from "vue";

/**
 * Returns a reactive debounced value of a source ref.
 * @param {Ref} source - The source ref to debounce.
 * @param {number} delay - Throttle delay in milliseconds.
 * @returns {Ref} - Reactive debounced ref.
 */
export function useDebounce(source, delay = 300) {
  const debouncedValue = ref(source.value);
  let timeoutId = null;

  watch(
    source,
    (newValue) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        debouncedValue.value = newValue;
      }, delay);
    },
    { immediate: true }
  );

  return debouncedValue;
}
