import DashboardHeader from "@/components/dashboard-header";
import DashboardShell from "@/components/dashboard-shell";
import PostCreateButton from "@/components/post-create-button";
import PostItem from "@/components/post-item";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    // ログインユーザーの取得
    const user = await getCurrentUser();
    // ユーザーが存在しない場合
    if (!user) {
        redirect("/login");
    }

    // Prismaからデータを取得
    const posts = await prisma.post.findMany({
        where: {
            authorId: user?.id,
        },
        select: {
            id: true,
            title: true,
            published: true,
            createdAt: true,
        },
        orderBy: {
            updatedAt: "desc",
        },
    });

    return (
        <DashboardShell>
            {/* ヘッダー */}
            <DashboardHeader heading="記事投稿" text="記事の投稿と管理">
                <PostCreateButton />
            </DashboardHeader>
            <div>
                {posts.length ? (
                    <div className="divide-y border rounded-md mt-5">
                        {posts.map((post) => (
                            <PostItem key={post.id} post={post} />
                        ))}
                    </div>
                ) : (
                    <div className="ml-2 mt-5">
                        投稿がありません。
                    </div>
                )}
            </div>
        </DashboardShell>
    )
}