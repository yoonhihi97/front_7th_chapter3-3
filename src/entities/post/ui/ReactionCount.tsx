import { ThumbsUp, ThumbsDown } from "lucide-react"

interface ReactionCountProps {
  likes: number
  dislikes: number
}

export const ReactionCount = ({ likes, dislikes }: ReactionCountProps) => {
  return (
    <div className="flex items-center gap-2">
      <ThumbsUp className="w-4 h-4" />
      <span>{likes}</span>
      <ThumbsDown className="w-4 h-4" />
      <span>{dislikes}</span>
    </div>
  )
}
