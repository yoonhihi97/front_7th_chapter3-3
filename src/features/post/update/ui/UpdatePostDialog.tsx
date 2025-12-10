import { useAtom } from "jotai"
import { selectedPostAtom } from "@/entities/post"
import { Button } from "@/shared/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog"
import { Input } from "@/shared/ui/input"
import { Textarea } from "@/shared/ui/textarea"
import { useUpdatePost } from "../api/useUpdatePost"

interface UpdatePostDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const UpdatePostDialog = ({ open, onOpenChange }: UpdatePostDialogProps) => {
  const [selectedPost, setSelectedPost] = useAtom(selectedPostAtom)
  const updatePost = useUpdatePost()

  const handleSubmit = () => {
    if (!selectedPost) return
    updatePost.mutate(selectedPost, {
      onSuccess: () => {
        onOpenChange(false)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={selectedPost?.title || ""}
            onChange={(e) =>
              selectedPost && setSelectedPost({ ...selectedPost, title: e.target.value })
            }
          />
          <Textarea
            rows={15}
            placeholder="내용"
            value={selectedPost?.body || ""}
            onChange={(e) =>
              selectedPost && setSelectedPost({ ...selectedPost, body: e.target.value })
            }
          />
          <Button onClick={handleSubmit} disabled={updatePost.isPending}>
            {updatePost.isPending ? "업데이트 중..." : "게시물 업데이트"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
