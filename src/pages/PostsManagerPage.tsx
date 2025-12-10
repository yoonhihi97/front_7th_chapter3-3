import { Plus, Search } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { tagQueries } from "@/entities/tag"
import { CreatePostDialog } from "@/features/post/create"
import { UpdatePostDialog } from "@/features/post/update"
import { useDeletePost } from "@/features/post/delete"
import { usePostDialogs } from "@/features/post/lib"
import { useUserModal } from "@/features/user/lib"
import { PostsTable, PostsTableProvider, usePostsParams, usePostsSearch } from "@/widgets/posts-table"
import { PostDetailDialog } from "@/widgets/post-detail-dialog"
import { UserModal } from "@/widgets/user-modal"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Input } from "@/shared/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select"

const PostsManager = () => {
  // 각 훅이 단일 책임
  const params = usePostsParams()
  const search = usePostsSearch(params.searchQuery, params.setSearch)
  const postDialogs = usePostDialogs()
  const userModal = useUserModal()
  const deletePost = useDeletePost()

  // TanStack Query - tags
  const { data: tags = [] } = useQuery(tagQueries.list())

  // 테이블 액션 조합 (컴포넌트에서 조합하는 것은 OK - 오케스트레이션)
  const tableActions = {
    onDeleteClick: deletePost.mutate,
    onDetailClick: postDialogs.openDetail,
    onEditClick: postDialogs.openEdit,
    onAuthorClick: userModal.openModal,
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => postDialogs.addDialog.onOpenChange(true)}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* 검색 및 필터 컨트롤 */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="게시물 검색..."
                leftAddon={<Search className="h-4 w-4" />}
                value={search.input}
                onChange={(e) => search.setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && search.submit()}
              />
            </div>
            <Select value={params.selectedTag} onValueChange={params.setTag}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="태그 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 태그</SelectItem>
                {tags.map((tag) => (
                  <SelectItem key={tag.url} value={tag.slug}>
                    {tag.slug}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={params.sortBy || "none"} onValueChange={params.setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="정렬 기준" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">없음</SelectItem>
                <SelectItem value="id">ID</SelectItem>
                <SelectItem value="title">제목</SelectItem>
                <SelectItem value="reactions">반응</SelectItem>
              </SelectContent>
            </Select>
            <Select value={params.sortOrder} onValueChange={params.setSortOrder}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="정렬 순서" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">오름차순</SelectItem>
                <SelectItem value="desc">내림차순</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 게시물 테이블 - Context로 액션 제공 */}
          <PostsTableProvider actions={tableActions}>
            <PostsTable />
          </PostsTableProvider>

          {/* 페이지네이션 */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span>표시</span>
              <Select value={params.limit.toString()} onValueChange={(v) => params.setLimit(Number(v))}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                </SelectContent>
              </Select>
              <span>항목</span>
            </div>
            <div className="flex gap-2">
              <Button disabled={params.skip === 0} onClick={params.goToPrevPage}>
                이전
              </Button>
              <Button onClick={params.goToNextPage}>다음</Button>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Features/Widgets Dialogs */}
      <CreatePostDialog {...postDialogs.addDialog} />
      <UpdatePostDialog {...postDialogs.editDialog} />
      <PostDetailDialog {...postDialogs.detailDialog} />
      <UserModal {...userModal.modal} />
    </Card>
  )
}

export default PostsManager
