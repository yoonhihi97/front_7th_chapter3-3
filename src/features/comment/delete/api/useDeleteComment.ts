import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/shared/api/base"

interface DeleteCommentDto {
  id: number
  postId: number
}

export const useDeleteComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: DeleteCommentDto) => apiClient.delete(`/comments/${id}`),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", "post", variables.postId] })
    },
  })
}
