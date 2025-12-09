import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { getPosts, getPostsByTag, searchPosts, Post, PostDto, PostsResponse } from "@/entities/post"
import { userQueries, UserPreview } from "@/entities/user"

interface UsePostsWithUsersOptions {
  limit: number
  skip: number
  searchQuery: string
  selectedTag: string
  sortBy: string
  sortOrder: string
}

interface UsePostsWithUsersResult {
  posts: Post[]
  total: number
  isLoading: boolean
  isError: boolean
}

export const usePostsWithUsers = ({
  limit,
  skip,
  searchQuery,
  selectedTag,
  sortBy,
  sortOrder,
}: UsePostsWithUsersOptions): UsePostsWithUsersResult => {
  const postsQuery = useQuery<PostsResponse>({
    queryKey: ["posts", { limit, skip, searchQuery, selectedTag, sortBy, sortOrder }],
    queryFn: () => {
      if (searchQuery) {
        return searchPosts(searchQuery)
      }
      if (selectedTag && selectedTag !== "all") {
        return getPostsByTag(selectedTag)
      }
      return getPosts(limit, skip)
    },
  })

  const usersQuery = useQuery(userQueries.list())

  const posts = useMemo(() => {
    if (!postsQuery.data?.posts) {
      return []
    }

    const usersMap = new Map<number, UserPreview>(
      (usersQuery.data?.users ?? []).map((user) => [user.id, user]),
    )

    const postsWithAuthors = postsQuery.data.posts.map((post: PostDto): Post => ({
      ...post,
      author: usersMap.get(post.userId),
    }))

    if (!sortBy) {
      return postsWithAuthors
    }

    return [...postsWithAuthors].sort((a, b) => {
      const aValue = a[sortBy as keyof Post]
      const bValue = b[sortBy as keyof Post]

      if (aValue == null || bValue == null) {
        return 0
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      return 0
    })
  }, [postsQuery.data, usersQuery.data, sortBy, sortOrder])

  return {
    posts,
    total: postsQuery.data?.total ?? 0,
    isLoading: postsQuery.isLoading || usersQuery.isLoading,
    isError: postsQuery.isError || usersQuery.isError,
  }
}
