import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/shared/api/base"
import type { PostsResponse } from "@/entities/post"

export const useDeletePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => apiClient.delete(`/posts/${id}`),
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] })

      const previousQueries = queryClient.getQueriesData<PostsResponse>({ queryKey: ["posts"] })

      queryClient.setQueriesData<PostsResponse>({ queryKey: ["posts"] }, (old) => {
        if (!old) return old
        return {
          ...old,
          posts: old.posts.filter((post) => post.id !== deletedId),
          total: old.total - 1,
        }
      })

      return { previousQueries }
    },
    onError: (_err, _id, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
  })
}
