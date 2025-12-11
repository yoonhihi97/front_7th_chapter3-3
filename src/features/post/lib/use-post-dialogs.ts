import { useCallback } from "react"
import { atom, useAtom, useSetAtom } from "jotai"
import { Post } from "@/entities/post"

// Atoms for dialog state
export const selectedPostAtom = atom<Post | null>(null)
export const isAddDialogOpenAtom = atom(false)
export const isEditDialogOpenAtom = atom(false)
export const isDetailDialogOpenAtom = atom(false)

interface UsePostDialogsReturn {
  // 다이얼로그 상태
  addDialog: { open: boolean; onOpenChange: (open: boolean) => void }
  editDialog: { open: boolean; onOpenChange: (open: boolean) => void }
  detailDialog: { open: boolean; onOpenChange: (open: boolean) => void }

  // 선택 + 다이얼로그 열기 액션
  openDetail: (post: Post) => void
  openEdit: (post: Post) => void
}

export const usePostDialogs = (): UsePostDialogsReturn => {
  const setSelectedPost = useSetAtom(selectedPostAtom)

  const [showAdd, setShowAdd] = useAtom(isAddDialogOpenAtom)
  const [showEdit, setShowEdit] = useAtom(isEditDialogOpenAtom)
  const [showDetail, setShowDetail] = useAtom(isDetailDialogOpenAtom)

  const openDetail = useCallback(
    (post: Post) => {
      setSelectedPost(post)
      setShowDetail(true)
    },
    [setSelectedPost, setShowDetail],
  )

  const openEdit = useCallback(
    (post: Post) => {
      setSelectedPost(post)
      setShowEdit(true)
    },
    [setSelectedPost, setShowEdit],
  )

  return {
    addDialog: { open: showAdd, onOpenChange: setShowAdd },
    editDialog: { open: showEdit, onOpenChange: setShowEdit },
    detailDialog: { open: showDetail, onOpenChange: setShowDetail },
    openDetail,
    openEdit,
  }
}
