import { apiClient } from "@/shared/api/base"
import { UserPreview } from "../model/user"

export interface UsersResponse {
  users: UserPreview[]
  total: number
  skip: number
  limit: number
}

export const getUsers = () =>
  apiClient.get<UsersResponse>("/users", { limit: 0, select: "username,image" })
