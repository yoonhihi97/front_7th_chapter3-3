import { useAtomValue } from "jotai"
import { selectedUserAtom, UserInfo } from "@/entities/user"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog"

interface UserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const UserModal = ({ open, onOpenChange }: UserModalProps) => {
  const selectedUser = useAtomValue(selectedUserAtom)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>사용자 정보</DialogTitle>
        </DialogHeader>
        {selectedUser && <UserInfo user={selectedUser} />}
      </DialogContent>
    </Dialog>
  )
}
