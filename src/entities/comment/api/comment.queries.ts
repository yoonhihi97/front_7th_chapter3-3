import { queryOptions } from "@tanstack/react-query"
import { getComments } from "./get-comments"

export const commentQueries = {
  all: () => ["comments"] as const,

  byPost: (postId: number) =>
    queryOptions({
      queryKey: [...commentQueries.all(), "post", postId],
      queryFn: () => getComments(postId),
    }),
}
