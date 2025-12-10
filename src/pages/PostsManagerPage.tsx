import { useState } from "react"
import { Plus, Search } from "lucide-react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAtom, useAtomValue } from "jotai"
import { useQuery } from "@tanstack/react-query"
import {
  selectedPostAtom,
  showAddPostDialogAtom,
  showEditPostDialogAtom,
  showPostDetailDialogAtom,
} from "@/entities/post"
import type { Comment } from "@/entities/comment"
import { commentQueries, CommentItem } from "@/entities/comment"
import { selectedUserAtom, showUserModalAtom, UserInfo } from "@/entities/user"
import { tagQueries } from "@/entities/tag"
import { useCreatePost } from "@/features/post/create"
import { useUpdatePost } from "@/features/post/update"
import { useDeletePost } from "@/features/post/delete"
import { useCreateComment } from "@/features/comment/create"
import { useUpdateComment } from "@/features/comment/update"
import { useDeleteComment } from "@/features/comment/delete"
import { useLikeComment } from "@/features/comment/like"
import { PostsTable } from "@/widgets/posts-table"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog"
import { Input } from "@/shared/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select"
import { Textarea } from "@/shared/ui/textarea"
import { highlightText } from "@/shared/lib/highlight"

const PostsManager = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // URL에서 상태 읽기
  const skip = parseInt(searchParams.get("skip") || "0")
  const limit = parseInt(searchParams.get("limit") || "10")
  const searchQuery = searchParams.get("search") || ""
  const sortBy = searchParams.get("sortBy") || ""
  const sortOrder = searchParams.get("sortOrder") || "asc"
  const selectedTag = searchParams.get("tag") || ""

  // 검색 입력값 (엔터 전 임시 상태)
  const [searchInput, setSearchInput] = useState(searchQuery)

  // Jotai atoms
  const [selectedPost, setSelectedPost] = useAtom(selectedPostAtom)
  const [showAddDialog, setShowAddDialog] = useAtom(showAddPostDialogAtom)
  const [showEditDialog, setShowEditDialog] = useAtom(showEditPostDialogAtom)
  const [showPostDetailDialog, setShowPostDetailDialog] = useAtom(showPostDetailDialogAtom)
  const selectedUser = useAtomValue(selectedUserAtom)
  const [showUserModal, setShowUserModal] = useAtom(showUserModalAtom)

  // TanStack Query - tags
  const { data: tags = [] } = useQuery(tagQueries.list())

  // TanStack Query - comments (선택된 게시물이 있을 때만)
  const { data: commentsData } = useQuery({
    ...commentQueries.byPost(selectedPost?.id ?? 0),
    enabled: !!selectedPost?.id && showPostDetailDialog,
  })
  const comments = commentsData?.comments ?? []

  // Mutations
  const createPost = useCreatePost()
  const updatePostMutation = useUpdatePost()
  const deletePostMutation = useDeletePost()
  const createComment = useCreateComment()
  const updateCommentMutation = useUpdateComment()
  const deleteCommentMutation = useDeleteComment()
  const likeCommentMutation = useLikeComment()

  // 로컬 form 상태
  const [newPost, setNewPost] = useState({ title: "", body: "", userId: 1 })
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [newComment, setNewComment] = useState({ body: "", postId: null as number | null, userId: 1 })
  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false)
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false)

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

  // 게시물 추가
  const handleAddPost = () => {
    createPost.mutate(newPost, {
      onSuccess: () => {
        setShowAddDialog(false)
        setNewPost({ title: "", body: "", userId: 1 })
      },
    })
  }

  // 게시물 업데이트
  const handleUpdatePost = () => {
    if (!selectedPost) return
    updatePostMutation.mutate(selectedPost, {
      onSuccess: () => {
        setShowEditDialog(false)
      },
    })
  }

  // 게시물 삭제
  const handleDeletePost = (id: number) => {
    deletePostMutation.mutate(id)
  }

  // 댓글 추가
  const handleAddComment = () => {
    if (!newComment.postId) return
    createComment.mutate(
      { body: newComment.body, postId: newComment.postId, userId: newComment.userId },
      {
        onSuccess: () => {
          setShowAddCommentDialog(false)
          setNewComment({ body: "", postId: null, userId: 1 })
        },
      },
    )
  }

  // 댓글 업데이트
  const handleUpdateComment = () => {
    if (!selectedComment || !selectedPost) return
    updateCommentMutation.mutate(
      { id: selectedComment.id, body: selectedComment.body, postId: selectedPost.id },
      {
        onSuccess: () => {
          setShowEditCommentDialog(false)
        },
      },
    )
  }

  // 댓글 삭제
  const handleDeleteComment = (id: number, postId: number) => {
    deleteCommentMutation.mutate({ id, postId })
  }

  // 댓글 좋아요
  const handleLikeComment = (comment: Comment, postId: number) => {
    likeCommentMutation.mutate({ id: comment.id, postId, currentLikes: comment.likes })
  }

  // 검색 실행 (엔터 키)
  const handleSearch = () => {
    updateURL({ search: searchInput, skip: "0" })
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
          <PostsTable onDeleteClick={handleDeletePost} />

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

      {/* 게시물 추가 대화상자 */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 게시물 추가</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="제목"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            />
            <Textarea
              rows={30}
              placeholder="내용"
              value={newPost.body}
              onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
            />
            <Input
              type="number"
              placeholder="사용자 ID"
              value={newPost.userId}
              onChange={(e) => setNewPost({ ...newPost, userId: Number(e.target.value) })}
            />
            <Button onClick={handleAddPost} disabled={createPost.isPending}>
              {createPost.isPending ? "추가 중..." : "게시물 추가"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 게시물 수정 대화상자 */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>게시물 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="제목"
              value={selectedPost?.title || ""}
              onChange={(e) =>
                selectedPost && setSelectedPost({ ...selectedPost, title: e.target.value })
              }
            />
            <Textarea
              rows={15}
              placeholder="내용"
              value={selectedPost?.body || ""}
              onChange={(e) =>
                selectedPost && setSelectedPost({ ...selectedPost, body: e.target.value })
              }
            />
            <Button onClick={handleUpdatePost} disabled={updatePostMutation.isPending}>
              {updatePostMutation.isPending ? "업데이트 중..." : "게시물 업데이트"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 댓글 추가 대화상자 */}
      <Dialog open={showAddCommentDialog} onOpenChange={setShowAddCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 댓글 추가</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="댓글 내용"
              value={newComment.body}
              onChange={(e) => setNewComment({ ...newComment, body: e.target.value })}
            />
            <Button onClick={handleAddComment} disabled={createComment.isPending}>
              {createComment.isPending ? "추가 중..." : "댓글 추가"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 댓글 수정 대화상자 */}
      <Dialog open={showEditCommentDialog} onOpenChange={setShowEditCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>댓글 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="댓글 내용"
              value={selectedComment?.body || ""}
              onChange={(e) =>
                selectedComment && setSelectedComment({ ...selectedComment, body: e.target.value })
              }
            />
            <Button onClick={handleUpdateComment} disabled={updateCommentMutation.isPending}>
              {updateCommentMutation.isPending ? "업데이트 중..." : "댓글 업데이트"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 게시물 상세 보기 대화상자 */}
      <Dialog open={showPostDetailDialog} onOpenChange={setShowPostDetailDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{highlightText(selectedPost?.title ?? "", searchQuery)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>{highlightText(selectedPost?.body ?? "", searchQuery)}</p>

            {/* 댓글 영역 */}
            {selectedPost && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold">댓글</h3>
                  <Button
                    size="sm"
                    onClick={() => {
                      setNewComment((prev) => ({ ...prev, postId: selectedPost.id }))
                      setShowAddCommentDialog(true)
                    }}
                  >
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
                      onLike={() => handleLikeComment(comment, selectedPost.id)}
                      onEdit={() => {
                        setSelectedComment(comment)
                        setShowEditCommentDialog(true)
                      }}
                      onDelete={() => handleDeleteComment(comment.id, selectedPost.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* 사용자 모달 */}
      <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>사용자 정보</DialogTitle>
          </DialogHeader>
          {selectedUser && <UserInfo user={selectedUser} />}
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default PostsManager
