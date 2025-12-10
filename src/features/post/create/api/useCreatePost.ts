import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/shared/api/base"
import type { PostDto } from "@/entities/post"

interface CreatePostDto {
  title: string
  body: string
  userId: number
}

export const useCreatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePostDto) => apiClient.post<PostDto>("/posts/add", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
  })
}
