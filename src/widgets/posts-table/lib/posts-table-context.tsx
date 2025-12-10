import { createContext, useContext, ReactNode } from "react"
import { Post } from "@/entities/post"

interface PostsTableContextValue {
  onDeleteClick: (id: number) => void
  onDetailClick: (post: Post) => void
  onEditClick: (post: Post) => void
  onAuthorClick: (userId: number) => void
}

const PostsTableContext = createContext<PostsTableContextValue | null>(null)

export const usePostsTableActions = () => {
  const context = useContext(PostsTableContext)
  if (!context) {
    throw new Error("usePostsTableActions must be used within a PostsTableProvider")
  }
  return context
}

interface PostsTableProviderProps {
  children: ReactNode
  actions: PostsTableContextValue
}

export const PostsTableProvider = ({ children, actions }: PostsTableProviderProps) => (
  <PostsTableContext.Provider value={actions}>{children}</PostsTableContext.Provider>
)
