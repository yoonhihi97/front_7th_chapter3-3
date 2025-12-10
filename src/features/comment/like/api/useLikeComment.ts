import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/shared/api/base"
import type { CommentDto } from "@/entities/comment"

interface LikeCommentDto {
  id: number
  postId: number
  currentLikes: number
}

export const useLikeComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, currentLikes }: LikeCommentDto) =>
      apiClient.patch<CommentDto>(`/comments/${id}`, { likes: currentLikes + 1 }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", "post", variables.postId] })
    },
  })
}
