import { useCallback } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

interface UsePostsParamsReturn {
  // 읽기
  skip: number
  limit: number
  selectedTag: string
  sortBy: string
  sortOrder: string
  searchQuery: string

  // 쓰기
  setTag: (tag: string) => void
  setSortBy: (sortBy: string) => void
  setSortOrder: (order: string) => void
  setSearch: (query: string) => void
  setLimit: (limit: number) => void
  goToNextPage: () => void
  goToPrevPage: () => void
}

export const usePostsParams = (): UsePostsParamsReturn => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // URL 파싱
  const skip = parseInt(searchParams.get("skip") || "0")
  const limit = parseInt(searchParams.get("limit") || "10")
  const selectedTag = searchParams.get("tag") || ""
  const sortBy = searchParams.get("sortBy") || ""
  const sortOrder = searchParams.get("sortOrder") || "asc"
  const searchQuery = searchParams.get("search") || ""

  // URL 업데이트 (내부 함수)
  const updateURL = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams)
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value)
        } else {
          params.delete(key)
        }
      })
      navigate(`?${params.toString()}`)
    },
    [searchParams, navigate],
  )

  // setter 함수들
  const setTag = useCallback(
    (tag: string) => {
      updateURL({ tag: tag === "all" ? "" : tag, skip: "0" })
    },
    [updateURL],
  )

  const setSortBy = useCallback(
    (sortBy: string) => {
      updateURL({ sortBy: sortBy === "none" ? "" : sortBy })
    },
    [updateURL],
  )

  const setSortOrder = useCallback(
    (order: string) => {
      updateURL({ sortOrder: order })
    },
    [updateURL],
  )

  const setSearch = useCallback(
    (query: string) => {
      updateURL({ search: query, skip: "0" })
    },
    [updateURL],
  )

  const setLimit = useCallback(
    (newLimit: number) => {
      updateURL({ limit: newLimit.toString(), skip: "0" })
    },
    [updateURL],
  )

  const goToNextPage = useCallback(() => {
    updateURL({ skip: (skip + limit).toString() })
  }, [updateURL, skip, limit])

  const goToPrevPage = useCallback(() => {
    updateURL({ skip: Math.max(0, skip - limit).toString() })
  }, [updateURL, skip, limit])

  return {
    skip,
    limit,
    selectedTag,
    sortBy,
    sortOrder,
    searchQuery,
    setTag,
    setSortBy,
    setSortOrder,
    setSearch,
    setLimit,
    goToNextPage,
    goToPrevPage,
  }
}
