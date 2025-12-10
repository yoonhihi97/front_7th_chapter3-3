import { useState, useCallback } from "react"

interface UsePostsSearchReturn {
  input: string
  setInput: (value: string) => void
  submit: () => void
}

export const usePostsSearch = (
  initialValue: string,
  onSubmit: (query: string) => void,
): UsePostsSearchReturn => {
  const [input, setInput] = useState(initialValue)

  const submit = useCallback(() => {
    onSubmit(input)
  }, [input, onSubmit])

  return { input, setInput, submit }
}
