import { PostRow } from "@/entities/post"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/shared/ui/table"
import { usePostsWithUsers } from "../lib/use-posts-with-users"
import { usePostsParams } from "../lib/use-posts-params"

export const PostsTable = () => {
  const { limit, skip, searchQuery, selectedTag, sortBy, sortOrder } = usePostsParams()

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
          <PostRow key={post.id} post={post} />
        ))}
      </TableBody>
    </Table>
  )
}
