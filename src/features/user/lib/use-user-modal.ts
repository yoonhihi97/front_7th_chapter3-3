import { useCallback } from "react"
import { atom, useAtom, useSetAtom } from "jotai"
import { getUserById, selectedUserAtom } from "@/entities/user"

export const isUserModalOpenAtom = atom(false)

interface UseUserModalReturn {
  modal: { open: boolean; onOpenChange: (open: boolean) => void }
  openModal: (userId: number) => Promise<void>
}

export const useUserModal = (): UseUserModalReturn => {
  const setSelectedUser = useSetAtom(selectedUserAtom)
  const [showModal, setShowModal] = useAtom(isUserModalOpenAtom)

  const openModal = useCallback(
    async (userId: number) => {
      const userData = await getUserById(userId)
      setSelectedUser(userData)
      setShowModal(true)
    },
    [setSelectedUser, setShowModal],
  )

  return {
    modal: { open: showModal, onOpenChange: setShowModal },
    openModal,
  }
}
