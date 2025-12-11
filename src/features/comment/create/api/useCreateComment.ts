import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/shared/api/base"
import { toast } from "@/shared/ui/toast"
import type { CommentDto, CommentsResponse } from "@/entities/comment"

interface CreateCommentDto {
  body: string
  postId: number
  userId: number
}

export const useCreateComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCommentDto) => apiClient.post<CommentDto>("/comments/add", data),
    onMutate: async (newComment) => {
      const queryKey = ["comments", "post", newComment.postId]
      await queryClient.cancelQueries({ queryKey })

      const previousData = queryClient.getQueryData<CommentsResponse>(queryKey)

      return { previousData, queryKey }
    },
    onSuccess: (data, _variables, context) => {
      if (context?.queryKey) {
        queryClient.setQueryData<CommentsResponse>(context.queryKey, (old) => {
          if (!old) return old
          return {
            ...old,
            comments: [...old.comments, data],
            total: old.total + 1,
          }
        })
      }
      toast.success("댓글이 추가되었습니다.")
    },
    onError: (_err, _newComment, context) => {
      toast.error("댓글 추가에 실패했습니다.")
      if (context?.previousData) {
        queryClient.setQueryData(context.queryKey, context.previousData)
      }
    },
  })
}
