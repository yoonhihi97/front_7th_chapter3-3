import { atom } from "jotai"

export interface Comment {
  id: number
  body: string
  postId: number
  likes: number
  user: {
    id: number
    username: string
    fullName: string
  }
}

export const selectedCommentAtom = atom<Comment | null>(null)
