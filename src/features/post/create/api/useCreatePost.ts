import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/shared/api/base"
import { toast } from "@/shared/ui/toast"
import type { PostDto, PostsResponse } from "@/entities/post"

interface CreatePostDto {
  title: string
  body: string
  userId: number
}

export const useCreatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePostDto) => apiClient.post<PostDto>("/posts/add", data),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["posts"] })
      const previousQueries = queryClient.getQueriesData<PostsResponse>({ queryKey: ["posts"] })
      return { previousQueries }
    },
    onSuccess: (data) => {
      queryClient.setQueriesData<PostsResponse>({ queryKey: ["posts"] }, (old) => {
        if (!old) return old
        return {
          ...old,
          posts: [data, ...old.posts],
          total: old.total + 1,
        }
      })
      toast.success("게시물이 추가되었습니다.")
    },
    onError: (_err, _newPost, context) => {
      toast.error("게시물 추가에 실패했습니다.")
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },
  })
}
