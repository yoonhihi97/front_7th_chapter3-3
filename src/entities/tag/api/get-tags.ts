import { apiClient } from "@/shared/api/base"
import type { Tag } from "../model/tag"

export const getTags = (): Promise<Tag[]> => {
  return apiClient.get<Tag[]>("/posts/tags")
}
