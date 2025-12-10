import { useState, useCallback } from "react"
import { useSetAtom } from "jotai"
import { Post, selectedPostAtom } from "@/entities/post"

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

  const [showAdd, setShowAdd] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showDetail, setShowDetail] = useState(false)

  const openDetail = useCallback(
    (post: Post) => {
      setSelectedPost(post)
      setShowDetail(true)
    },
    [setSelectedPost],
  )

  const openEdit = useCallback(
    (post: Post) => {
      setSelectedPost(post)
      setShowEdit(true)
    },
    [setSelectedPost],
  )

  return {
    addDialog: { open: showAdd, onOpenChange: setShowAdd },
    editDialog: { open: showEdit, onOpenChange: setShowEdit },
    detailDialog: { open: showDetail, onOpenChange: setShowDetail },
    openDetail,
    openEdit,
  }
}
