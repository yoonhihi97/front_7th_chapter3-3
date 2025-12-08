import { apiClient } from "@/shared/api/base"
import { PostsResponse } from "./get-posts"

export const searchPosts = (query: string) =>
  apiClient.get<PostsResponse>("/posts/search", { q: query })
