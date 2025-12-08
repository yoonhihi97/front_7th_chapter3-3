import { apiClient } from "@/shared/api/base"

export interface CommentDto {
  id: number
  body: string
  postId: number
  likes: number
  user: {
    id: number
    username: string
    fullName: string
  }
}

export interface CommentsResponse {
  comments: CommentDto[]
  total: number
  skip: number
  limit: number
}

export const getComments = (postId: number) =>
  apiClient.get<CommentsResponse>(`/comments/post/${postId}`)
