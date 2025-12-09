import { atom } from "jotai"

export interface Post {
  id: number
  title: string
  body: string
  userId: number
  tags: string[]
  reactions: {
    likes: number
    dislikes: number
  }
  views: number
  author?: {
    id: number
    username: string
    image: string
  }
}

// 선택된 게시물 (상세 보기, 수정 등에서 사용)
export const selectedPostAtom = atom<Post | null>(null)

// Dialog 상태
export const showAddPostDialogAtom = atom(false)
export const showEditPostDialogAtom = atom(false)
export const showPostDetailDialogAtom = atom(false)
