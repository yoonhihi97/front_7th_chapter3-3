import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/shared/api/base"
import { toast } from "@/shared/ui/toast"
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
    onSuccess: () => {
      toast.success("게시물이 수정되었습니다.")
    },
    onError: (_err, _post, context) => {
      toast.error("게시물 수정에 실패했습니다.")
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },
  })
}
