import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/shared/api/base"
import type { CommentDto } from "@/entities/comment"

interface CreateCommentDto {
  body: string
  postId: number
  userId: number
}

export const useCreateComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCommentDto) => apiClient.post<CommentDto>("/comments/add", data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", "post", variables.postId] })
    },
  })
}
