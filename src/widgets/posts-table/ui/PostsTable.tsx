import { useSearchParams } from "react-router-dom"
import { Post, PostRow } from "@/entities/post"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/shared/ui/table"
import { usePostsWithUsers } from "../lib/use-posts-with-users"

interface PostsTableProps {
  onDeleteClick: (id: number) => void
  onDetailClick: (post: Post) => void
  onEditClick: (post: Post) => void
  onAuthorClick: (userId: number) => void
}

export const PostsTable = ({
  onDeleteClick,
  onDetailClick,
  onEditClick,
  onAuthorClick,
}: PostsTableProps) => {
  const [searchParams] = useSearchParams()

  const limit = parseInt(searchParams.get("limit") || "10")
  const skip = parseInt(searchParams.get("skip") || "0")
  const searchQuery = searchParams.get("search") || ""
  const selectedTag = searchParams.get("tag") || ""
  const sortBy = searchParams.get("sortBy") || ""
  const sortOrder = searchParams.get("sortOrder") || "asc"

  const { posts, isLoading } = usePostsWithUsers({
    limit,
    skip,
    searchQuery,
    selectedTag,
    sortBy,
    sortOrder,
  })

  if (isLoading) {
    return <div className="flex justify-center p-4">로딩 중...</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">ID</TableHead>
          <TableHead>제목</TableHead>
          <TableHead className="w-[150px]">작성자</TableHead>
          <TableHead className="w-[150px]">반응</TableHead>
          <TableHead className="w-[150px]">작업</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <PostRow
            key={post.id}
            post={post}
            onDeleteClick={onDeleteClick}
            onDetailClick={onDetailClick}
            onEditClick={onEditClick}
            onAuthorClick={onAuthorClick}
          />
        ))}
      </TableBody>
    </Table>
  )
}
