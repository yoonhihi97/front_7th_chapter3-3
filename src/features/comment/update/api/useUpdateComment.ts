import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/shared/api/base"
import type { CommentDto } from "@/entities/comment"

interface UpdateCommentDto {
  id: number
  body: string
  postId: number
}

export const useUpdateComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, body }: UpdateCommentDto) =>
      apiClient.put<CommentDto>(`/comments/${id}`, { body }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", "post", variables.postId] })
    },
  })
}
