import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/shared/api/base"
import { toast } from "@/shared/ui/toast"
import type { CommentsResponse } from "@/entities/comment"

interface DeleteCommentDto {
  id: number
  postId: number
}

export const useDeleteComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: DeleteCommentDto) => apiClient.delete(`/comments/${id}`),
    onMutate: async (deletedComment) => {
      const queryKey = ["comments", "post", deletedComment.postId]
      await queryClient.cancelQueries({ queryKey })

      const previousData = queryClient.getQueryData<CommentsResponse>(queryKey)

      queryClient.setQueryData<CommentsResponse>(queryKey, (old) => {
        if (!old) return old
        return {
          ...old,
          comments: old.comments.filter((comment) => comment.id !== deletedComment.id),
          total: old.total - 1,
        }
      })

      return { previousData, queryKey }
    },
    onSuccess: () => {
      toast.success("댓글이 삭제되었습니다.")
    },
    onError: (_err, _comment, context) => {
      toast.error("댓글 삭제에 실패했습니다.")
      if (context?.previousData) {
        queryClient.setQueryData(context.queryKey, context.previousData)
      }
    },
  })
}
