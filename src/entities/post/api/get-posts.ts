import { apiClient } from "@/shared/api/base"

export interface PostDto {
  id: number
  title: string
  body: string
  userId: number
  tags: string[]
  reactions: {
    likes: number
    dislikes: number
  }
  views: number
}

export interface PostsResponse {
  posts: PostDto[]
  total: number
  skip: number
  limit: number
}

export const getPosts = (limit: number, skip: number) =>
  apiClient.get<PostsResponse>("/posts", { limit, skip })
