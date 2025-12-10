import { useState } from "react"
import { Button } from "@/shared/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog"
import { Textarea } from "@/shared/ui/textarea"
import { useCreateComment } from "../api/useCreateComment"

interface CreateCommentDialogProps {
  postId: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const CreateCommentDialog = ({ postId, open, onOpenChange }: CreateCommentDialogProps) => {
  const [body, setBody] = useState("")
  const createComment = useCreateComment()

  const handleSubmit = () => {
    createComment.mutate(
      { body, postId, userId: 1 },
      {
        onSuccess: () => {
          onOpenChange(false)
          setBody("")
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 댓글 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea placeholder="댓글 내용" value={body} onChange={(e) => setBody(e.target.value)} />
          <Button onClick={handleSubmit} disabled={createComment.isPending}>
            {createComment.isPending ? "추가 중..." : "댓글 추가"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
