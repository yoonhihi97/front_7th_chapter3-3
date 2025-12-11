import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/shared/api/base"
import { toast } from "@/shared/ui/toast"
import type { CommentDto, CommentsResponse } from "@/entities/comment"

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
    onMutate: async (updatedComment) => {
      const queryKey = ["comments", "post", updatedComment.postId]
      await queryClient.cancelQueries({ queryKey })

      const previousData = queryClient.getQueryData<CommentsResponse>(queryKey)

      queryClient.setQueryData<CommentsResponse>(queryKey, (old) => {
        if (!old) return old
        return {
          ...old,
          comments: old.comments.map((comment) =>
            comment.id === updatedComment.id ? { ...comment, body: updatedComment.body } : comment,
          ),
        }
      })

      return { previousData, queryKey }
    },
    onSuccess: () => {
      toast.success("댓글이 수정되었습니다.")
    },
    onError: (_err, _comment, context) => {
      toast.error("댓글 수정에 실패했습니다.")
      if (context?.previousData) {
        queryClient.setQueryData(context.queryKey, context.previousData)
      }
    },
  })
}
