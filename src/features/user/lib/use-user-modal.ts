import { useState, useCallback } from "react"
import { useSetAtom } from "jotai"
import { getUserById, selectedUserAtom } from "@/entities/user"

interface UseUserModalReturn {
  modal: { open: boolean; onOpenChange: (open: boolean) => void }
  openModal: (userId: number) => Promise<void>
}

export const useUserModal = (): UseUserModalReturn => {
  const setSelectedUser = useSetAtom(selectedUserAtom)
  const [showModal, setShowModal] = useState(false)

  const openModal = useCallback(
    async (userId: number) => {
      const userData = await getUserById(userId)
      setSelectedUser(userData)
      setShowModal(true)
    },
    [setSelectedUser],
  )

  return {
    modal: { open: showModal, onOpenChange: setShowModal },
    openModal,
  }
}
