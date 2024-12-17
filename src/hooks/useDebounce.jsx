import { useEffect, useState } from "react"

export const useDebounce = (value) => {
  const [debounceValue, setDebounceValue] = useState(value)

  useEffect(() => {
    const handler = window.setTimeout(() => {
      setDebounceValue(value)
    }, 200)

    return () => {
      window.clearTimeout(handler);
    }
  }, [value])

  return debounceValue;
}