import { atom } from "jotai"

export interface UserPreview {
  id: number
  username: string
  image: string
}

export interface User extends UserPreview {
  firstName: string
  lastName: string
  age: number
  email: string
  phone: string
  address: {
    address: string
    city: string
    state: string
  }
  company: {
    name: string
    title: string
  }
}

// 선택된 사용자 (모달에서 사용)
export const selectedUserAtom = atom<User | null>(null)
