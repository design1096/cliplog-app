import { Post } from "@prisma/client"
import { format } from "date-fns"
import Link from "next/link"
import PostOperations from "./post-operations"

interface PostItemProps {
  post: Pick<Post, "id" | "title" | "published" | "createdAt">
}

export default function PostItem({ post }: PostItemProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="grid gap-1">
        {/* タイトルリンク */}
        <Link href={`/editor/${post.id}`} className="font-semibold hover:underline">
          {post.title}
        </Link>
        {/* 記事の作成日 */}
        <div>
          <p className="text-sm text-muted-foreground">
            {format(post.createdAt, "yyyy-MM-dd")}
          </p>
        </div>
      </div>
      {/* 記事の編集・削除 */}
      <PostOperations post={post} />
    </div>
  )
}