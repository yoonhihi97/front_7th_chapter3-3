import { useAtom } from "jotai"
import { selectedCommentAtom } from "@/entities/comment"
import { Button } from "@/shared/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog"
import { Textarea } from "@/shared/ui/textarea"
import { useUpdateComment } from "../api/useUpdateComment"

interface UpdateCommentDialogProps {
  postId: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const UpdateCommentDialog = ({ postId, open, onOpenChange }: UpdateCommentDialogProps) => {
  const [selectedComment, setSelectedComment] = useAtom(selectedCommentAtom)
  const updateComment = useUpdateComment()

  const handleSubmit = () => {
    if (!selectedComment) return
    updateComment.mutate(
      { id: selectedComment.id, body: selectedComment.body, postId },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={selectedComment?.body || ""}
            onChange={(e) =>
              selectedComment && setSelectedComment({ ...selectedComment, body: e.target.value })
            }
          />
          <Button onClick={handleSubmit} disabled={updateComment.isPending}>
            {updateComment.isPending ? "업데이트 중..." : "댓글 업데이트"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
