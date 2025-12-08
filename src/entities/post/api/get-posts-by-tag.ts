import { apiClient } from "@/shared/api/base"
import { PostsResponse } from "./get-posts"

export const getPostsByTag = (tag: string) =>
  apiClient.get<PostsResponse>(`/posts/tag/${tag}`)
