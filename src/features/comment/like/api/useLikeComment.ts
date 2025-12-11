import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/shared/api/base"
import type { CommentDto, CommentsResponse } from "@/entities/comment"

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
    onMutate: async (likedComment) => {
      const queryKey = ["comments", "post", likedComment.postId]
      await queryClient.cancelQueries({ queryKey })

      const previousData = queryClient.getQueryData<CommentsResponse>(queryKey)

      queryClient.setQueryData<CommentsResponse>(queryKey, (old) => {
        if (!old) return old
        return {
          ...old,
          comments: old.comments.map((comment) =>
            comment.id === likedComment.id
              ? { ...comment, likes: likedComment.currentLikes + 1 }
              : comment,
          ),
        }
      })

      return { previousData, queryKey }
    },
    onError: (_err, _comment, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(context.queryKey, context.previousData)
      }
    },
  })
}
