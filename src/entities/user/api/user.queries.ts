import { queryOptions } from "@tanstack/react-query"
import { getUsers } from "./get-users"
import { getUserById } from "./get-user-by-id"

export const userQueries = {
  all: () => ["users"] as const,

  list: () =>
    queryOptions({
      queryKey: [...userQueries.all(), "list"],
      queryFn: getUsers,
      staleTime: Infinity,
    }),

  detail: (id: number) =>
    queryOptions({
      queryKey: [...userQueries.all(), "detail", id],
      queryFn: () => getUserById(id),
      enabled: !!id,
    }),
}
