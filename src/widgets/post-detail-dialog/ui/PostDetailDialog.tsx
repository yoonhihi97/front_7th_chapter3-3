import { useState } from "react"
import { Plus } from "lucide-react"
import { useSearchParams } from "react-router-dom"
import { useAtomValue } from "jotai"
import { useQuery } from "@tanstack/react-query"
import { selectedPostAtom } from "@/features/post"
import { CommentItem, CreateCommentDialog, UpdateCommentDialog } from "@/features/comment"
import { commentQueries } from "@/entities/comment"
import { Button } from "@/shared/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog"
import { highlightText } from "@/shared/lib/highlight"

interface PostDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const PostDetailDialog = ({ open, onOpenChange }: PostDetailDialogProps) => {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get("search") || ""

  const selectedPost = useAtomValue(selectedPostAtom)

  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false)
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false)

  const { data: commentsData } = useQuery({
    ...commentQueries.byPost(selectedPost?.id ?? 0),
    enabled: !!selectedPost?.id && open,
  })
  const comments = commentsData?.comments ?? []

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{highlightText(selectedPost?.title ?? "", searchQuery)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>{highlightText(selectedPost?.body ?? "", searchQuery)}</p>

            {selectedPost && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold">댓글</h3>
                  <Button size="sm" onClick={() => setShowAddCommentDialog(true)}>
                    <Plus className="w-3 h-3 mr-1" />
                    댓글 추가
                  </Button>
                </div>
                <div className="space-y-1">
                  {comments.map((comment) => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      searchQuery={searchQuery}
                      onEditClick={() => setShowEditCommentDialog(true)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {selectedPost && (
        <>
          <CreateCommentDialog
            postId={selectedPost.id}
            open={showAddCommentDialog}
            onOpenChange={setShowAddCommentDialog}
          />
          <UpdateCommentDialog
            postId={selectedPost.id}
            open={showEditCommentDialog}
            onOpenChange={setShowEditCommentDialog}
          />
        </>
      )}
    </>
  )
}
