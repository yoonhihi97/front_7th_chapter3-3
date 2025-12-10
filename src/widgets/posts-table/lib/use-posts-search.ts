import { useState, useCallback, useEffect } from "react"

interface UsePostsSearchReturn {
  input: string
  setInput: (value: string) => void
  submit: () => void
}

export const usePostsSearch = (
  searchQuery: string,
  onSubmit: (query: string) => void,
): UsePostsSearchReturn => {
  const [input, setInput] = useState(searchQuery)

  useEffect(() => {
    setInput(searchQuery)
  }, [searchQuery])

  const submit = useCallback(() => {
    onSubmit(input)
  }, [input, onSubmit])

  return { input, setInput, submit }
}
