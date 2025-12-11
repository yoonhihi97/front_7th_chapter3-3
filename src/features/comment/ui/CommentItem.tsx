import { useSetAtom } from "jotai"
import { Edit2, ThumbsUp, Trash2 } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { highlightText } from "@/shared/lib/highlight"
import { Comment, selectedCommentAtom } from "@/entities/comment"
import { useDeleteComment } from "../delete"
import { useLikeComment } from "../like"

interface CommentItemProps {
  comment: Comment
  searchQuery: string
  onEditClick: () => void
}

export const CommentItem = ({ comment, searchQuery, onEditClick }: CommentItemProps) => {
  const setSelectedComment = useSetAtom(selectedCommentAtom)
  const deleteComment = useDeleteComment()
  const likeComment = useLikeComment()

  const handleLike = () => {
    likeComment.mutate({ id: comment.id, postId: comment.postId, currentLikes: comment.likes })
  }

  const handleEdit = () => {
    setSelectedComment(comment)
    onEditClick()
  }

  const handleDelete = () => {
    deleteComment.mutate({ id: comment.id, postId: comment.postId })
  }

  return (
    <div className="flex items-center justify-between text-sm border-b pb-1">
      <div className="flex items-center space-x-2 overflow-hidden">
        <span className="font-medium truncate">{comment.user.username}:</span>
        <span className="truncate">{highlightText(comment.body, searchQuery)}</span>
      </div>
      <div className="flex items-center space-x-1">
        <Button variant="ghost" size="sm" onClick={handleLike}>
          <ThumbsUp className="w-3 h-3" />
          <span className="ml-1 text-xs">{comment.likes}</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={handleEdit}>
          <Edit2 className="w-3 h-3" />
        </Button>
        <Button variant="ghost" size="sm" onClick={handleDelete}>
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  )
}
