import { queryOptions } from "@tanstack/react-query"
import { getTags } from "./get-tags"

export const tagQueries = {
  all: () => ["tags"] as const,

  list: () =>
    queryOptions({
      queryKey: tagQueries.all(),
      queryFn: getTags,
      staleTime: Infinity,
    }),
}
