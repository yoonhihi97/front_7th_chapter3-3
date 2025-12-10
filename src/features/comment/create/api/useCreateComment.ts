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

      const tempComment: CommentDto = {
        id: Date.now(),
        body: newComment.body,
        postId: newComment.postId,
        likes: 0,
        user: { id: newComment.userId, username: "", fullName: "" },
      }

      queryClient.setQueryData<CommentsResponse>(queryKey, (old) => {
        if (!old) return old
        return {
          ...old,
          comments: [...old.comments, tempComment],
          total: old.total + 1,
        }
      })

      return { previousData, queryKey }
    },
    onSuccess: () => {
      toast.success("댓글이 추가되었습니다.")
    },
    onError: (_err, _newComment, context) => {
      toast.error("댓글 추가에 실패했습니다.")
      if (context?.previousData) {
        queryClient.setQueryData(context.queryKey, context.previousData)
      }
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", "post", variables.postId] })
    },
  })
}
