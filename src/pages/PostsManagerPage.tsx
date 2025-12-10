import { useState } from "react"
import { Plus, Search } from "lucide-react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useSetAtom } from "jotai"
import { useQuery } from "@tanstack/react-query"
import { Post, selectedPostAtom } from "@/entities/post"
import { getUserById, selectedUserAtom } from "@/entities/user"
import { tagQueries } from "@/entities/tag"
import { CreatePostDialog } from "@/features/post/create"
import { UpdatePostDialog } from "@/features/post/update"
import { useDeletePost } from "@/features/post/delete"
import { PostsTable } from "@/widgets/posts-table"
import { PostDetailDialog } from "@/widgets/post-detail-dialog"
import { UserModal } from "@/widgets/user-modal"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Input } from "@/shared/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select"

const PostsManager = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // URL에서 상태 읽기
  const skip = parseInt(searchParams.get("skip") || "0")
  const limit = parseInt(searchParams.get("limit") || "10")
  const selectedTag = searchParams.get("tag") || ""
  const sortBy = searchParams.get("sortBy") || ""
  const sortOrder = searchParams.get("sortOrder") || "asc"
  const searchQuery = searchParams.get("search") || ""

  // 검색 입력값 (엔터 전 임시 상태)
  const [searchInput, setSearchInput] = useState(searchQuery)

  // Dialog 상태 - 모두 로컬 useState로 관리
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)

  // 선택된 항목 - Jotai atoms (여러 컴포넌트에서 공유)
  const setSelectedPost = useSetAtom(selectedPostAtom)
  const setSelectedUser = useSetAtom(selectedUserAtom)

  // TanStack Query - tags
  const { data: tags = [] } = useQuery(tagQueries.list())

  // 게시물 삭제 mutation
  const deletePost = useDeletePost()

  // URL 업데이트 함수
  const updateURL = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
    navigate(`?${params.toString()}`)
  }

  const handleSearch = () => {
    updateURL({ search: searchInput, skip: "0" })
  }

  const handleDeletePost = (id: number) => {
    deletePost.mutate(id)
  }

  const handleDetailClick = (post: Post) => {
    setSelectedPost(post)
    setShowPostDetailDialog(true)
  }

  const handleEditClick = (post: Post) => {
    setSelectedPost(post)
    setShowEditDialog(true)
  }

  const handleAuthorClick = async (userId: number) => {
    const userData = await getUserById(userId)
    setSelectedUser(userData)
    setShowUserModal(true)
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => setShowAddDialog(true)}>
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
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Select
              value={selectedTag}
              onValueChange={(value) => updateURL({ tag: value === "all" ? "" : value, skip: "0" })}
            >
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
            <Select
              value={sortBy || "none"}
              onValueChange={(value) => updateURL({ sortBy: value === "none" ? "" : value })}
            >
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
            <Select value={sortOrder} onValueChange={(value) => updateURL({ sortOrder: value })}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="정렬 순서" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">오름차순</SelectItem>
                <SelectItem value="desc">내림차순</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 게시물 테이블 */}
          <PostsTable
            onDeleteClick={handleDeletePost}
            onDetailClick={handleDetailClick}
            onEditClick={handleEditClick}
            onAuthorClick={handleAuthorClick}
          />

          {/* 페이지네이션 */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span>표시</span>
              <Select
                value={limit.toString()}
                onValueChange={(value) => updateURL({ limit: value, skip: "0" })}
              >
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
              <Button
                disabled={skip === 0}
                onClick={() => updateURL({ skip: Math.max(0, skip - limit).toString() })}
              >
                이전
              </Button>
              <Button onClick={() => updateURL({ skip: (skip + limit).toString() })}>다음</Button>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Features/Widgets Dialogs */}
      <CreatePostDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
      <UpdatePostDialog open={showEditDialog} onOpenChange={setShowEditDialog} />
      <PostDetailDialog open={showPostDetailDialog} onOpenChange={setShowPostDetailDialog} />
      <UserModal open={showUserModal} onOpenChange={setShowUserModal} />
    </Card>
  )
}

export default PostsManager
