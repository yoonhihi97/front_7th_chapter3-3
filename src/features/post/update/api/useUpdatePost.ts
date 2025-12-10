import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/shared/api/base"
import type { Post, PostDto, PostsResponse } from "@/entities/post"

export const useUpdatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (post: Post) => apiClient.put<PostDto>(`/posts/${post.id}`, post),
    onMutate: async (updatedPost) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] })

      const previousQueries = queryClient.getQueriesData<PostsResponse>({ queryKey: ["posts"] })

      queryClient.setQueriesData<PostsResponse>({ queryKey: ["posts"] }, (old) => {
        if (!old) return old
        return {
          ...old,
          posts: old.posts.map((post) =>
            post.id === updatedPost.id ? { ...post, ...updatedPost } : post,
          ),
        }
      })

      return { previousQueries }
    },
    onError: (_err, _post, context) => {
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
