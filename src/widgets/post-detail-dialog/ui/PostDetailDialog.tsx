import { useState } from "react"
import { Plus } from "lucide-react"
import { useSearchParams } from "react-router-dom"
import { useAtomValue, useSetAtom } from "jotai"
import { useQuery } from "@tanstack/react-query"
import { selectedPostAtom } from "@/features/post"
import { commentQueries, CommentItem, selectedCommentAtom } from "@/entities/comment"
import { CreateCommentDialog } from "@/features/comment/create"
import { UpdateCommentDialog } from "@/features/comment/update"
import { useDeleteComment } from "@/features/comment/delete"
import { useLikeComment } from "@/features/comment/like"
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
  const setSelectedComment = useSetAtom(selectedCommentAtom)

  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false)
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false)

  const { data: commentsData } = useQuery({
    ...commentQueries.byPost(selectedPost?.id ?? 0),
    enabled: !!selectedPost?.id && open,
  })
  const comments = commentsData?.comments ?? []

  const deleteComment = useDeleteComment()
  const likeComment = useLikeComment()

  const handleLikeComment = (commentId: number, currentLikes: number) => {
    if (!selectedPost) return
    likeComment.mutate({ id: commentId, postId: selectedPost.id, currentLikes })
  }

  const handleDeleteComment = (commentId: number) => {
    if (!selectedPost) return
    deleteComment.mutate({ id: commentId, postId: selectedPost.id })
  }

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
                      onLike={() => handleLikeComment(comment.id, comment.likes)}
                      onEdit={() => {
                        setSelectedComment(comment)
                        setShowEditCommentDialog(true)
                      }}
                      onDelete={() => handleDeleteComment(comment.id)}
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
