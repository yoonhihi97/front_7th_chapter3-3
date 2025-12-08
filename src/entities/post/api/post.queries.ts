import { queryOptions } from "@tanstack/react-query"
import { getPosts } from "./get-posts"
import { getPostsByTag } from "./get-posts-by-tag"
import { searchPosts } from "./search-posts"

export const postQueries = {
  all: () => ["posts"] as const,

  lists: () => [...postQueries.all(), "list"] as const,

  list: (limit: number, skip: number) =>
    queryOptions({
      queryKey: [...postQueries.lists(), { limit, skip }],
      queryFn: () => getPosts(limit, skip),
    }),

  byTag: (tag: string) =>
    queryOptions({
      queryKey: [...postQueries.all(), "tag", tag],
      queryFn: () => getPostsByTag(tag),
    }),

  search: (query: string) =>
    queryOptions({
      queryKey: [...postQueries.all(), "search", query],
      queryFn: () => searchPosts(query),
    }),
}
