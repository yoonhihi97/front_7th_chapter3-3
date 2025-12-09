import { apiClient } from "@/shared/api/base"
import { User } from "../model/user"

export const getUserById = (id: number) => apiClient.get<User>(`/users/${id}`)
