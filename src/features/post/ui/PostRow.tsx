import { useSetAtom } from "jotai"
import { Edit2, MessageSquare, Trash2 } from "lucide-react"
import { TableCell, TableRow } from "@/shared/ui/table"
import { Button } from "@/shared/ui/button"
import { Avatar } from "@/shared/ui/avatar"
import { highlightText } from "@/shared/lib/highlight"
import { Post, ReactionCount } from "@/entities/post"
import { useUserModal } from "@/features/user/lib"
import { useDeletePost } from "../delete"
import { selectedPostAtom, isDetailDialogOpenAtom, isEditDialogOpenAtom } from "../lib/use-post-dialogs"

interface PostRowProps {
  post: Post
  searchQuery: string
  selectedTag: string
  onTagClick: (tag: string) => void
}

export const PostRow = ({ post, searchQuery, selectedTag, onTagClick }: PostRowProps) => {
  const { mutate: deletePost } = useDeletePost()
  const setSelectedPost = useSetAtom(selectedPostAtom)
  const setIsDetailOpen = useSetAtom(isDetailDialogOpenAtom)
  const setIsEditOpen = useSetAtom(isEditDialogOpenAtom)
  const { openModal: openUserModal } = useUserModal()

  const handleTagClick = (tag: string) => {
    onTagClick(tag)
  }

  const handleAuthorClick = () => {
    if (post.author) {
      openUserModal(post.author.id)
    }
  }

  const handleDetailClick = () => {
    setSelectedPost(post)
    setIsDetailOpen(true)
  }

  const handleEditClick = () => {
    setSelectedPost(post)
    setIsEditOpen(true)
  }

  const handleDeleteClick = () => {
    deletePost(post.id)
  }

  return (
    <TableRow>
      <TableCell>{post.id}</TableCell>
      <TableCell>
        <div className="space-y-1">
          <div>{highlightText(post.title, searchQuery)}</div>
          <div className="flex flex-wrap gap-1">
            {post.tags?.map((tag) => (
              <span
                key={tag}
                className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
                  selectedTag === tag
                    ? "text-white bg-blue-500 hover:bg-blue-600"
                    : "text-blue-800 bg-blue-100 hover:bg-blue-200"
                }`}
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2 cursor-pointer" onClick={handleAuthorClick}>
          <Avatar src={post.author?.image} alt={post.author?.username} size="md" />
          <span>{post.author?.username}</span>
        </div>
      </TableCell>
      <TableCell>
        <ReactionCount likes={post.reactions?.likes || 0} dislikes={post.reactions?.dislikes || 0} />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleDetailClick}>
            <MessageSquare className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleEditClick}>
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDeleteClick}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}
