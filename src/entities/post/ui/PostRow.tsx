import { Edit2, MessageSquare, Trash2 } from "lucide-react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { TableCell, TableRow } from "@/shared/ui/table"
import { Button } from "@/shared/ui/button"
import { Avatar } from "@/shared/ui/avatar"
import { highlightText } from "@/shared/lib/highlight"
import { ReactionCount } from "./ReactionCount"
import { Post } from "../model/post"

interface PostRowProps {
  post: Post
  onDeleteClick: (id: number) => void
  onDetailClick: (post: Post) => void
  onEditClick: (post: Post) => void
  onAuthorClick: (userId: number) => void
}

export const PostRow = ({
  post,
  onDeleteClick,
  onDetailClick,
  onEditClick,
  onAuthorClick,
}: PostRowProps) => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get("search") || ""
  const selectedTag = searchParams.get("tag") || ""

  const handleTagClick = (tag: string) => {
    const params = new URLSearchParams(searchParams)
    params.set("tag", tag)
    params.set("skip", "0")
    navigate(`?${params.toString()}`)
  }

  const handleAuthorClick = () => {
    if (post.author) {
      onAuthorClick(post.author.id)
    }
  }

  const handleDetailClick = () => {
    onDetailClick(post)
  }

  const handleEditClick = () => {
    onEditClick(post)
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
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={handleAuthorClick}
        >
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
          <Button variant="ghost" size="sm" onClick={() => onDeleteClick(post.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}
